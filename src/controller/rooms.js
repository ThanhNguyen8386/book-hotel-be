import Room from "../models/room"
import Comment from "../models/comments"
import slugify from "slugify"
import DateBooked from "../models/dateBooked"
import Category from '../models/categories'
import comments from "../models/comments"


export const creat = async (req, res) => {
    req.body.slug = slugify(req.body.name)

    try {
        const add = await Room(req.body).save()
        res.json(add)
    } catch (error) {
        console.log(error);

    }
}
export const getAll = async (req, res) => {
    try {
        const room = await Room.find().exec()
        res.json(room)

    } catch (error) {
        console.log(error);
    }
}

export const getOne = async (req, res) => {
    try {
        const room = await Room.find({ slug: req.params.slug }).populate('category').exec()
        res.json(room[0])
    } catch (error) {
        console.log(error);

    }
}


export const remove = async (req, res) => {
    try {
        const deleteRomm = await Room.findOneAndDelete({ _id: req.params.id }).exec()
        res.json(deleteRomm)
    } catch (error) {
        console.log(error);

    }
}

export const update = async (req, res) => {
    try {
        const newRoom = await Room.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
        console.log(newRoom);
        res.json(newRoom)
    } catch (error) {
        console.log(error);
    }
}

// check trùng lặp thời gian
function areTwoDateTimeRangesOverlapping(incommingDateTimeRange, existingDateTimeRange) {
    return incommingDateTimeRange.start < existingDateTimeRange.end
        && incommingDateTimeRange.end > existingDateTimeRange.start
}

function areManyDateTimeRangesOverlapping(incommingDateTimeRange, existingDateTimeRanges) {
    return existingDateTimeRanges.some((existingDateTimeRange) => areTwoDateTimeRangesOverlapping(incommingDateTimeRange, existingDateTimeRange))
}


export const search = async (req, res) => {
    const { checkInDate, checkOutDate } = req.body;

    if (!checkInDate || !checkOutDate) {
        res.json("vui lòng nhập thời gian checkin và checkout");
        return;
    }

    try {
        let result = [];

        const listDateBooked = await DateBooked.find().exec();
        const rooms = await Room.find().exec();

        rooms.forEach(room => {
            const dateBookedByRoom = listDateBooked.filter(item => item.room.toString() == room._id.toString());
            if (!dateBookedByRoom.length) {
                result.push(room);
            } else {
                const listDateByRoom = dateBookedByRoom.map(item => {
                    return {
                        start: new Date(item.dateFrom).getTime(),
                        end: new Date(item.dateTo).getTime()
                    };
                });

                // trạng thái phòng trống.
                const status = areManyDateTimeRangesOverlapping({
                    start: new Date(checkInDate).getTime(),
                    end: new Date(checkOutDate).getTime()
                }, listDateByRoom);

                if (!status) result.push(room);
            }
        })

        res.json(result);
    } catch (error) {
        res.status(404).json(error);
    }
}

export const read = async (req, res) => {
    try {
        const room = await Room.findOne({ slug: req.params.slug }).exec();
        const comments = await Comment.find({ room: room }).populate('room').select('-room').exec()
        res.json({
            comments
        });
    } catch (error) {

    }
}

export const getRoomByCategory = async (req, res) => {
    try {
        const { _id, slug, name, address } = await Category.findOne({ slug: req.params.slug });
        const roomByCategory = await Room.find({
            category: _id,
            status: true
        })
        const roomIds = roomByCategory.map(item => item._id);
        const reviews = await comments.find({ room: { $in: roomIds } })
            .populate('user', 'name avatar')
            .populate('room', 'name');
        const listImageRoom = [];
        const listRatings = [];
        if (roomByCategory.length > 0) {
            roomByCategory.forEach((item, index) => {
                item.image.forEach((e) => {
                    listImageRoom.push(e)
                })
                listRatings.push(...item.ratings);
            })
        }
        const _roomByCate = [...roomByCategory];
        const rating = _roomByCate.reduce((accumulator, currentValue) => {
            return accumulator += +(currentValue.ratingAvg);
        }, 0)
        const data = {
            listRatings: listRatings,
            rating: rating,
            address: address,
            images: listImageRoom,
            name: name,
            slug: slug,
            _id: _id,
            roomList: roomByCategory,
            reviews: reviews
        }
        res.json(data)
    } catch (error) {
        console.log(error);
    }
}

export const getRoomAvailabe = async (req, res) => {
    try {
        const { dateFrom, dateTo, categoryId } = req.body;

        if (!dateFrom || !dateTo || !categoryId) {
            return res.status(400).json({ message: "Thiếu thông tin dateFrom, dateTo hoặc categoryId" });
        }

        // Lấy danh sách phòng đã được đặt trong khoảng thời gian người dùng chọn
        const bookedRooms = await DateBooked.find({
            $or: [
                { dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } } // Phòng đã được đặt trong khoảng thời gian chọn
            ]
        }).distinct("room"); // Lấy danh sách ID phòng đã bị đặt

        // Tìm các phòng thuộc category nhưng chưa bị đặt
        const availableRooms = await Room.find({
            _id: { $nin: bookedRooms }, // Loại bỏ phòng đã bị đặt
            category: categoryId // Chỉ lấy phòng thuộc category được chọn
        });

        res.json(availableRooms);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

export const availableCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng cung cấp ngày bắt đầu và ngày kết thúc" });
        }

        // Chuyển đổi startDate, endDate sang ISODate
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Lấy danh sách các room đã được đặt trong khoảng thời gian
        const bookedRooms = await DateBooked.find({
            $or: [
                { dateFrom: { $lte: end }, dateTo: { $gte: start } }, // Khoảng thời gian bị chồng lấn
            ],
        }).distinct("room");

        // Lọc ra các phòng chưa bị đặt
        const availableRooms = await Room.find({
            _id: { $nin: bookedRooms }, // Loại bỏ các phòng đã bị đặt
        });

        // Nhóm phòng theo category và lấy ảnh phòng
        const categories = await Category.find();
        const result = categories.map(category => {
            const roomsInCategory = availableRooms.filter(room => room.category.toString() === category._id.toString());
            return roomsInCategory.length > 0
                ? {
                    category: category.name,
                    categoryImage: category.image, // Giả sử category có trường ảnh
                    rooms: roomsInCategory.map(room => ({
                        roomName: room.name,
                        roomImage: room.image // Giả sử room có trường ảnh
                    }))
                }
                : null;
        }).filter(item => item !== null); // Chỉ lấy category có phòng khả dụng

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
}