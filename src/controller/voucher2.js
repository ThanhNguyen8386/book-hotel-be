import voucher2 from '../models/voucher2';

// Lấy danh sách voucher phù hợp
export const getAvailableVouchers = async (req, res) => {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
        return res.status(400).json({ message: 'Room ID, check-in, and check-out dates are required' });
    }

    try {
        const now = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const vouchers = await voucher2.find({
            applicableRooms: roomId,
            isActive: true,
            quantity: { $gt: 0 },
            startDate: { $lte: checkInDate },
            endDate: { $gte: checkOutDate },
        })

        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Xác minh mã voucher
export const verifyVoucher = async (req, res) => {
    const { code, roomId, checkIn, checkOut } = req.body;

    if (!code || !roomId || !checkIn || !checkOut) {
        return res.status(400).json({ message: 'Voucher code, room ID, check-in, and check-out dates are required' });
    }

    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const voucher = await voucher2.findOne({
            code: code.toUpperCase(),
            applicableRooms: roomId,
            isActive: true,
            quantity: { $gt: 0 },
            startDate: { $lte: checkInDate },
            endDate: { $gte: checkOutDate },
        });

        if (!voucher) {
            return res.status(400).json({ message: 'Invalid or expired voucher' });
        }

        res.json({
            message: 'Voucher is valid',
            voucher: {
                code: voucher.code,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Tạo voucher (chỉ admin)
export const createVoucher = async (req, res) => {
    const {
        name,
        code,
        discountType,
        discountValue,
        quantity,
        startDate,
        endDate,
        applicableRooms,
    } = req.body;

    try {
        const voucher = new voucher2({
            name,
            code: code.toUpperCase(),
            discountType,
            discountValue,
            quantity,
            startDate,
            endDate,
            applicableRooms,
        });
        await voucher.save();
        res.status(201).json({ message: 'Voucher created', voucher });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getAllVoucher = async (req, res) => {
    const data = await voucher2.find();
    res.json(data);
}
