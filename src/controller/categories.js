import Category from '../models/categories'
import Facilities from '../models/Facilities';
import Room from "../models/room"
import slugify from 'slugify'

export const getCategoryPagination = async (req, res) => {
    try {
        const { page = 1, size = 10, search = '' } = req.query;

        // Chuyển đổi page và size thành số nguyên
        const pageNum = parseInt(page);
        const sizeNum = parseInt(size);

        // Đảm bảo page và size hợp lệ
        if (pageNum < 1 || sizeNum < 1) {
            return res.status(400).json({ message: 'Page and size must be greater than 0' });
        }

        // Tạo query tìm kiếm
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } }, // Tìm kiếm theo name (không phân biệt hoa thường)
                { address: { $regex: search, $options: 'i' } }, // Tìm kiếm theo address
            ];
        }

        // Tính toán phân trang
        const totalItems = await Category.countDocuments(query); // Tổng số bản ghi
        const totalPages = Math.ceil(totalItems / sizeNum); // Tổng số trang
        const skip = (pageNum - 1) * sizeNum; // Số bản ghi cần bỏ qua

        // Lấy danh sách danh mục với phân trang và populate
        const categories = await Category.find(query)
            .populate('facilities')
            .populate({
                path: 'rooms',
                populate: { path: 'listFacility' },
            })
            .skip(skip)
            .limit(sizeNum)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)

        // Trả về kết quả
        res.status(200).json({
            data: categories,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNum,
                pageSize: sizeNum,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getall = async (req, res) => {
    try {
        const result = await Category.find()
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getone = async (req, res) => {
    const Cate = await Category.findOne({ slug: req.params.slug })
    res.json(Cate)
}

export const detail = async (req, res) => {
    const Cate = await Category.findById({ _id: req.params.id }).populate('facilities rooms')
    res.json(Cate)
}

export const creat = async (req, res) => {
    try {
        const { name, status, address, image, facilities, introduction } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name are required' });
        }

        // Kiểm tra danh sách tiện ích
        if (!Array.isArray(facilities)) {
            return res.status(400).json({ message: 'Facilities must be an array' });
        }

        const facilityDocs = await Facilities.find({ _id: { $in: facilities } });
        if (facilityDocs.length !== facilities.length) {
            return res.status(400).json({ message: 'One or more facilities not found' });
        }

        // Tạo danh mục mới
        const newCategory = new Category({
            name,
            slug: slugify(name),
            status: status !== undefined ? status : true,
            address: address || 'Hà nội',
            image: image || 'http://res.cloudinary.com/dkhutgvlb/image/upload/v1739795711/xwfbzfrvi09g0h3sxwfs.jpg',
            facilities,
            rooms: [],
            introduction
        });
        await newCategory.save();

        const populatedCategory = await Category.findById(newCategory._id).populate('facilities');
        res.status(201).json(populatedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category slug already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const update = async (req, res) => {
    try {
        const { name, status, address, image, facilities, introduction } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Cập nhật thông tin danh mục
        if (name) category.name = name;
        if (status !== undefined) category.status = status;
        if (address) category.address = address;
        if (image) category.image = image;
        category.slug = slugify(name);
        if (introduction) category.introduction = introduction;

        // Cập nhật danh sách tiện ích
        if (Array.isArray(facilities)) {
            const facilityDocs = await Facilities.find({ _id: { $in: facilities } });
            if (facilityDocs.length !== facilities.length) {
                return res.status(400).json({ message: 'One or more facilities not found' });
            }
            category.facilities = facilities;
        }

        await category.save();

        const populatedCategory = await Category.findById(category._id).populate('facilities');
        res.status(200).json(populatedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category slug already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const remove = async (req, res) => {
    const Cate = await Category.findOneAndDelete({ _id: req.params.id })
    res.json(Cate)
}


export const read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug }).exec()
        // console.log(category)
        const rooms = await Room.find({ category: category }).populate('category').select().exec()
        res.json({
            // category,
            rooms
        })
    } catch (error) {

    }
}

export const getAllCategoryWithImage = async (req, res) => {
    try {
        // Lấy tất cả các danh mục
        const categories = await Category.find();

        // Tạo một mảng các promises để lấy một ảnh đại diện cho mỗi danh mục
        const categoriesWithImagePromises = categories.map(async (category) => {
            // Tìm phòng đầu tiên trong danh mục này có ảnh
            const room = await Room.findOne({
                category: category._id,
                status: true,
                image: { $exists: true, $not: { $size: 0 } }
            }); // Lấy phòng mới nhất

            // Chuyển đổi category thành đối tượng thuần túy JavaScript
            const categoryObj = category.toObject();

            // Nếu tìm thấy phòng có ảnh, sử dụng ảnh đầu tiên của phòng làm ảnh đại diện
            if (room && room.image && room.image.length > 0) {
                categoryObj.representativeImage = room.image[0]; // Lấy ảnh đầu tiên từ mảng image
            } else {
                // Nếu không tìm thấy phòng hoặc phòng không có ảnh, sử dụng ảnh mặc định từ category
                categoryObj.representativeImage = category.image;
            }

            return categoryObj;
        });

        // Chờ tất cả các promises hoàn thành
        const categoriesWithImage = await Promise.all(categoriesWithImagePromises);

        // Trả về kết quả
        return res.status(200).json({
            success: true,
            data: categoriesWithImage
        });
    } catch (error) {
        console.error('Error fetching categories with room images:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh mục với ảnh đại diện',
            error: error.message
        });
    }
};
