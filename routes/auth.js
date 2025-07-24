const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashed });
        if (email === "bigmansimba2@gmail.com") user.isAdmin = true;

        await user.save();
        res.status(201).json({ message: "Registered" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;