const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

router.get("/trace/:uid", async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Trace failed" });
    }
});

module.exports = router;