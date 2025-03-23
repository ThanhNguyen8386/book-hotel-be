import Category from '../models/categories'
import Room from "../models/room"
import slugify from 'slugify'

export const getall = async (req, res) => {
    const list = await Category.find().exec()
    res.json(list)
}

export const getone = async (req, res) => {
    const Cate = await Category.findOne({ slug: req.params.slug })
    res.json(Cate)
}

export const creat = async (req, res) => {
    req.body.slug = slugify(req.body.name)
    try {
        const add = await Category(req.body).save()
        res.json(add)
    } catch (error) {

    }
}

export const update = async (req, res) => {
    req.body.slug = slugify(req.body.name)
    try {
        const UpdateCate = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(UpdateCate)
    } catch (error) {

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
