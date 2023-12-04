const bcrypt = require("bcrypt");

const Users = require("../models/user.model");

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await Users.find();

      res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const userInfor = await Users.findOne({ email: email });

      if (password !== user.password)
        return res.status(400).json({ message: "password not correct!" });

      const user = {
        _id: userInfor._id,
        name: userInfor.name,
        role: userInfor.role,
      };

      res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password, phone, address } = req.body;

      const emailCheck = await Users.findOne({ email: email });

      if (emailCheck) {
        return res
          .status(400)
          .json({ message: "This email already exists!!!" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters." });
      }

      const newUser = await Users.create({
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
      });

      res.json({
        message: "Register successfully!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }, // Fix the variable name here, it should be newUser, not user
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");

      if (!user)
        return res.status(400).json({ message: "User does not exist!" });

      res.json({ message: "success", user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, phone, address, role } = req.body;
      if (!name)
        return res.status(400).json({ message: "Please enter full name." });

      if (!phone)
        return res.status(400).json({ message: "Please enter full name." });

      if (role) {
        await Users.findByIdAndUpdate(
          { _id: req.params.id },
          { name, phone, address, role }
        );

        const user = await Users.findById(req.params.id).select("-password");
        return res.json({ message: "Update successfully!", user: user });
      }

      await Users.findByIdAndUpdate(
        { _id: req.params.id },
        { name, phone, address }
      );
      const user = await Users.findById(req.params.id).select("-password");
      return res.json({ message: "Update successfully!", user: user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await Users.findById(userId).select("-password");
      if (!user) {
        return res.status(400).json({ message: "User dose not exits" });
      }
      await Users.findOneAndRemove({ _id: userId });

      res.json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = userController;
