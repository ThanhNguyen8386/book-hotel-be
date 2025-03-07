import { generateAccessToken, generateRefreshToken } from "../middlewares/checkAuth";
import User from "../models/users";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, avatar, role, phone } = await new User(
      req.body
    ).save();

    res.status(201).json({
      name,
      email,
      avatar,
      role,
      phone,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.status(404).json({
        message: "Email không tồn tại",
      });
      return;
    }

    if (!user.isAuthenticate(password)) {
      res.status(404).json({
        message: "Mật khẩu không chính xác",
      });
      return;
    }

    if (user) {
      if (user.status != 1) {
        res.status(404).json({
          message: "Tài khoản đã bị khóa",
        });
        return;
      }
    }

    const token = generateAccessToken({ email })
    const refreshToken = generateRefreshToken({ email })
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true, secure: false
    // })
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // Đổi thành true khi dùng HTTPS
    // });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        token: token,
        refreshToken: refreshToken
      },
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error,
    });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json({ message: "Không có Refresh Token" })

  jwt.verify(refreshToken, "Happyweekend", (err, user) => {
    if (err) return res.status(403).json({ message: "Refresh Token hết hạn, vui lòng đăng nhập lại" })

    const newAccessToken = generateAccessToken({ email: user.email })
    res.json({ accessToken: newAccessToken })  // Trả về Access Token mới
  })
}
// export const logOut = async (req, res) => {
//   refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//   res.json({ message: "Đã đăng xuất" })
// }
