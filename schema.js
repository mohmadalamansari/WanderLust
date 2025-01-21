const joi = require('joi');
const Listing = require('./model/listing');


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