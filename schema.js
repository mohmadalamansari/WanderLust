const joi = require('joi');
const Listing = require('./model/listing');
const review = require('./model/review');


module.exports.listingSchema = joi.object({
    Listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location :joi.string().required(),
        country :joi.string().required().min(0),
        price :joi.number().required(),
        Image : joi.string(). allow("", null) 
    }).required()
});

const Joi = require('joi');

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), 
    comment: Joi.string().default('No comment provided'), 
  }).required()
});
