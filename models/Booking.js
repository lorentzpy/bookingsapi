const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
    {
        from: {
            type: Date,
            required: [true, 'this field required you soab'],
            validate: {
              validator: function(value) {
                return value instanceof Date;
              },
              message: 'from is not a valid date'
            }
          },
        to: { type: Date, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        created: { type: Date, required: true },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        modified: { type: Date, required: true },
        status: { type: String, required: true},
        comment: { type: String, required: false }
    },
    { collection: 'mgv_bookings' }
);
 
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;