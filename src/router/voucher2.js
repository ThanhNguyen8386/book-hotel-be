const { Router } = require('express')
const { getAvailableVouchers, verifyVoucher, createVoucher, getAllVoucher, detailVoucher } = require('../controller/voucher2')

const router = Router()

router.get("/getAvailableVouchers", getAvailableVouchers)
router.post("/verifyVoucher", verifyVoucher)
router.post("/createVoucher", createVoucher)
router.get("/getAllVoucher", getAllVoucher)
router.get("/detailVoucher/:voucherCode", detailVoucher)

module.exports = router