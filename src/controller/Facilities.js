import Faci from "../models/Facilities"
import slugify from "slugify"
import Category from '../models/categories'
import mongoose from "mongoose"

export const create = async (req, res) => {
    req.body.slug = slugify(req.body.name)
    try {
        const add = await Faci(req.body).save()
        res.json(add)
    } catch (error) {

    }
}

export const remove = async (req, res) => {
    try {
        const deleteFaci = await Faci.findOneAndDelete({ _id: req.params.id }).exec()
        res.json(deleteFaci)
    } catch (error) {

    }
}

export const update = async (req, res) => {
    req.body.slug = slugify(req.body.name)
    try {
        const updateFaci = await Faci.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
        res.json(updateFaci)
    } catch (error) {

    }
}

export const getAll = async (req, res) => {
    try {
        const getFaci = await Faci.find().exec()
        res.json(getFaci)
    } catch (error) {
        console.log(error);

    }
}

export const getOne = async (req, res) => {
    try {
        // const Faci = await Faci.find({ slug: req.params.slug }).exec()
        // res.json(Faci[0])
        const abc = await Faci.find({ room: req.params.room }).populate('room').select('-room').exec()
        res.json(abc)
    } catch (error) {

    }
}

export const listByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Kiểm tra categoryId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Tìm category và populate facilities
        const category = await Category.findById(categoryId).populate('facilities').lean();

        // Kiểm tra category tồn tại
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Kiểm tra xem category có facilities không
        if (!category.facilities || category.facilities.length === 0) {
            return res.status(404).json({ message: 'No facilities found for this category' });
        }

        // Trả về danh sách facilities
        res.status(200).json({
            category: {
                _id: category._id,
                name: category.name,
            },
            facilities: category.facilities,
        });
    } catch (error) {
        console.error('Error fetching facilities:', error);
        res.status(500).json({ message: 'Server error' });
    }
}