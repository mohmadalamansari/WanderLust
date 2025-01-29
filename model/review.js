const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: {
        type: String,  // Fixed 'String' instead of Joi's 'string'
        // required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // Use Date.now without parentheses
    }
});

// Export the model correctly
module.exports = mongoose.model("Review", reviewSchema);
