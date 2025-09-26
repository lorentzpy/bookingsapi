const Joi = require("joi");
const nodemailer = require("nodemailer");

const Booking = require("../models/Booking");

exports.getBookings = async (req, res) => {

    try {

        const { month } = req.params;

        const { exclude } = req.query;

        let filter = {};
        let filterMonths = {};
        let filterAnd = [];

        if (month) {
            const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
            const startDay = startOfMonth.getUTCDay() === 0 ? 6 : startOfMonth.getUTCDay() - 1;
            const displayStart = new Date(startOfMonth);
            displayStart.setUTCDate(displayStart.getUTCDate() - startDay);
        
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);
            endOfMonth.setUTCDate(0); // dernier jour du mois
            const endDay = endOfMonth.getUTCDay() === 0 ? 6 : endOfMonth.getUTCDay() - 1;
            const displayEnd = new Date(endOfMonth);
            displayEnd.setUTCDate(displayEnd.getUTCDate() + (6 - endDay));
        
            const conditions = [];
        
            // 3 cas classiques : chevauchement dans n'importe quelle direction
            conditions.push({ from: { $lte: displayEnd }, to: { $gte: displayStart } });
        
            filterMonths["$or"] = conditions;
        }

        if (exclude) {
            excludeFilter = {_id: {$ne: exclude}};
            filter = {"$and": [filterMonths, excludeFilter]};
        } else {
            filter = filterMonths;
        }

        const {sortBy, order } = req.query;

        const sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === "desc" ? -1:1;
        }

        const bookings = await Booking.find(filter)
                                      .sort(sortOptions)
                                      .populate("createdBy", "username")
                                      .populate("modifiedBy", "username");
        res.status(200).json(bookings);
    } catch (err) {
        console.error(err); 
        res.status(500).json({error: "fetch bookings failed"});
    }
};

exports.createBooking = async (req, res) => {

    const bookingPayload = req.body;

    bookingPayload.from = new Date(bookingPayload.from);
    bookingPayload.to = new Date(bookingPayload.to);
    
    const currentTime = new Date();
    
    bookingPayload.created = currentTime;
    bookingPayload.modified = currentTime;

    const booking = new Booking(bookingPayload);

    try {
        const bookingPost = await booking.save();
        res.status(201).json({message: "Booking created successfully!", booking: bookingPost});

    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            console.log(error.errors);
            res.status(400).json({ message: 'Données invalides', errors: error.errors });
        } else {
            res.status(500).json({
                error: "booking post failed",
                details: error.message || error
            });
        }
    }

};

sendMail = async ( to, subject, body) => {

    // create Transporter
    const transporter = nodemailer.createTransport({
        host: "foo",
        port: 587,
        secure: true,
        auth: {
            user: "foo",
            pass: "bar"
        }
    })

    try {
        const mailOptions = {
            from: "blabla@foo.com",
            to: to,
            replyTo: "blabla@foo.com",
            subject: subject,
            body: body
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);

    } catch(err) {

    }

}

exports.deleteBooking = async (req, res) => {
    
    try {
        const { id:bookingId } = req.params;

        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            res.status(400).json({message: `Booking with id ${bookingId} does not exist`});
        }

        res.status(200).json({message: `Booking with id ${bookingId} deleted successfully`});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting the booking" });
    }

}

exports.updateBooking = async (req, res) => {
    try {
        const {id: bookingId } = req.params;

        const bookingUpdatePayload = req.body;

        const currentTime = new Date();
        bookingUpdatePayload.modified = currentTime;

        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, bookingUpdatePayload);

        if (!updatedBooking) {
            res.status(400).json({message: `Booking with id ${bookingId} does not exist`});
        }

        res.status(200).json({message: `Booking with id ${bookingId} modified successfully`});

    } catch (err) {
        res.status(500).json({ error: "An error occurred while updating the booking"});
    }
};