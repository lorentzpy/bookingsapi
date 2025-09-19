const express = require("express");
const router = express.Router();

const bookingsController = require("../controllers/bookingsController");

const authMiddleware = require("../middleware/authMiddleware");

// bookings
router.get("/", authMiddleware, bookingsController.getBookings);
router.get("/:month?", authMiddleware, bookingsController.getBookings);
router.post("/", authMiddleware, bookingsController.createBooking);
router.delete("/:id",authMiddleware, bookingsController.deleteBooking);
router.patch("/:id", authMiddleware, bookingsController.updateBooking);

module.exports = router;