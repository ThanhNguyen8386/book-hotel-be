import {Router} from 'express'
import { creat, getall, getAllCategoryWithImage, getone, read, remove, update } from '../controller/categories'

const router = Router()

router.get("/categories", getall)
router.get("/getAllCategoryWithImage", getAllCategoryWithImage)
router.get("/category/:slug", getone)
router.delete("/category/:id", remove)
router.put("/category/:id/edit", update)
router.post("/categories", creat)
router.get('/categorys/:slug', read)


module.exports = router