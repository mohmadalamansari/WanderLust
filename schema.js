const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required(),
      description: joi.string().required(),
      image: joi.string().allow("", null),
      location: joi.string().required(),
      country: joi.string().required().min(0),
    })
    .required(),
});



const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().default("No comment provided"),
  }).required(),
});
