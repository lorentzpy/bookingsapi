const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// users
router.get("/", userController.getUsers);
router.get("/:id/prefs", userController.getPrefs);
router.post("/:id/prefs", userController.updatePrefs);
router.patch("/:id/password", userController.setPassword);
//router.patch("/:id/password", userController.updatePassword);

module.exports = router;