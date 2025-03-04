import { Router } from "express";
import { signup, signin, refreshToken } from "../controller/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshToken);

module.exports = router;
