const {Router} = require('express')
const { getAll, getOne, create, remove, update, listByCategory } = require('../controller/Facilities')


const router = Router()


router.get("/facilities",getAll)
router.get("/facilities/:room",getOne)
router.post("/facilities",create)
router.delete("/facilities/:id/delete", remove)
router.put("/facilities/:id/edit", update)
router.get("/facilities/:categoryId/category", listByCategory)

module.exports = router