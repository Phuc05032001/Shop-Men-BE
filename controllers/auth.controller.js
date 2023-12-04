const Users = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  getMe: async (req, res) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "InValid Authorization.", code: 401 });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decoded) {
        return res.status(400).json({ message: "InValid Authorization." });
      }

      const user = await Users.findOne({ _id: decoded.id });
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password, phone, address, role } = req.body;

      const emailCheck = await Users.findOne({ email });
      const phoneCheck = await Users.findOne({ phone });

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!name) {
      }

      if (!phone) {
        return res.status(400).json({ message: "Phone is required" });
      }

      // if (!role) {
      //   return res.status(400).json({ message: "Role is required" });
      // }

      if (password?.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters." });
      }
      if (emailCheck) {
        return res.status(400).json({ message: "This email already exists" });
      }

      if (phoneCheck) {
        return res.status(400).json({ message: "This phone already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await Users.create({
        name: name,
        email: email,
        password: passwordHash,
        phone: phone,
        role: role,
        address: address,
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("refrestoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 2 * 60 * 60 * 1000,
      });

      await newUser.save();

      res.json({
        msg: "Register successfully!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "This email does not exits!!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "password is incorrect." });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/auth/refresh_token",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        access_token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/auth/refresh_token" });
      return res.json({ message: "Logged out account!!!!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: async (req, res) => {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token)
      return res.status(400).json({ message: "Please login now." });

    jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, result) => {
        if (error) return res.status(400).json({ msg: "Please login now." });

        const user = await Users.findById(result.id).select("-password");

        if (!user) return res.status(400).json({ msg: "This does not exist." });

        const access_token = createAccessToken({ id: result.id });

        res.json({
          access_token,
        });
      }
    );

    try {
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = authController;
