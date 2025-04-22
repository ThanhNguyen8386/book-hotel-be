const { Router } = require('express')
const { getAvailableVouchers, verifyVoucher, createVoucher, getAllVoucher } = require('../controller/voucher2')

const router = Router()

router.get("/getAvailableVouchers", getAvailableVouchers)
router.post("/verifyVoucher", verifyVoucher)
router.post("/createVoucher", createVoucher)
router.get("/getAllVoucher", getAllVoucher)

module.exports = router