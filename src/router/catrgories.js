import { Router } from 'express'
import { creat, getall, getAllCategoryWithImage, getone, read, remove, update } from '../controller/categories'
import { roleMiddleware, verifyToken } from '../middlewares/checkAuth'

const router = Router()

router.get("/categories", getall)
router.get("/getAllCategoryWithImage", getAllCategoryWithImage)
router.get("/category/:slug", getone)
router.delete("/category/:id", verifyToken, roleMiddleware([1]), remove)
router.put("/category/:id/edit", verifyToken, roleMiddleware([1]), update)
router.post("/categories", verifyToken, roleMiddleware([1]), creat)
router.get('/categorys/:slug', read)


module.exports = router