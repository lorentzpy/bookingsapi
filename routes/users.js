const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// users
router.get("/", userController.getUsers);
router.get("/:id/prefs", authMiddleware, userController.getPrefs);
router.post("/:id/prefs", authMiddleware, userController.updatePrefs);
router.patch("/:id/password", authMiddleware, userController.setPassword);

module.exports = router;