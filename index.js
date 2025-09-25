
require('dotenv').config();
const Joi = require("joi");
const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const app = express();
const bookingsRoutes = require("./routes/bookings.js");
const userRoutes = require("./routes/users.js");
const loginRoutes = require("./routes/login.js");
const auth = require("./middleware/authMiddleware.js");

const { connectDb, disconnectDb } = require("./config/connect.js");

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            callback(new Error("Not allowed by cors"));
        }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }));
  
app.use(express.json());
app.use(helmet());

// connect to mongo
connectDb();

app.use("/bookings", bookingsRoutes);
app.use("/user", userRoutes);
app.use("/auth", loginRoutes);

app.use(( req, res, next ) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use( (err, req, res, next) => {
    res.status( err.status || 500 ).json({
        error: err.message || "Internal server error"
    })
});

// PORT
const port = process.env.PORT || 3100
server = app.listen(port, () => console.log("Listening on port " + port));