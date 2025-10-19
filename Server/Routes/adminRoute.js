// routes/admin.js
const express = require("express");
const router  = express.Router();
const Admin   = require("../Model/Admin");

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Authentication successful
    res.status(200).send({
      message: "Welcome Admin",
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;