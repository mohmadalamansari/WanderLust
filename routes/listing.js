const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); // Import the Mongoose model for listings
const wrapAsync = require("../utils/wrapasync"); // Utility function to catch async errors
const { listingSchema, reviewSchema } = require("../schema"); // Validation schema for listings
const ExpressError = require("../utils/ExpressError"); // Custom error handler class

// Middleware to validate the listing data
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.listing); // Ensure the correct object is being validated
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg); // Error if validation fails
  } else {
    next(); // Proceed to next middleware if no error
  }
};

// Index Route - Lists all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from the database
    res.render("listing/index", { allListings }); // Render the "index" template with the listings data
  })
);

// New Route - Displays a form for creating a new listing
router.get("/new", (req, res) => {
  res.render("listing/new"); // Render the "new" template for adding a listing
});

// Show Route - Displays details of a specific listing
router.get(
  "/listings:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from request parameters
    const listing = await Listing.findById(id).populate("review"); // Find the listing by ID
    if (!listing) {
      return next(new ExpressError(404, "Listing not found")); // Handle missing listing
    }
    res.render("listing/show", { listing }); // Render the "show" template with the listing data
  })
);


// Create Route - Adds a new listing to the database
router.post(
  "/",
  validateListing, // Use validation middleware
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing); // Create a new listing
    await newListing.save(); // Save the listing to the database
    res.redirect("/listings"); // Redirect to the index route after saving
  })
);

// Edit Route - Displays a form for editing an existing listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params; // Extract the ID from request parameters
    const listing = await Listing.findById(id); // Find the listing by ID
    res.render("listing/edit", { listing }); // Render the "edit" template with the listing data
  })
);

// Update Route - Updates an existing listing in the database
router.put(
  "/:id",
  validateListing, // Use validation middleware
  wrapAsync(async (req, res, next) => {
    const { id } = req.params; // Extract the ID from request parameters
    const updatedListing = req.body.listing; // Extract updated data from request body
    const listing = await Listing.findByIdAndUpdate(id, updatedListing, { new: true }); // Update listing in the database
    if (!listing) {
      return next(new ExpressError(404, "Listing not found for update")); // Handle missing listing
    }
    res.redirect(`/listings/${id}`); // Redirect to the show route for the updated listing
  })
);

// Delete Route - Deletes a listing from the database
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing by ID
    if (!deletedListing) {
      return next(new ExpressError(404, "Listing not found for deletion")); // Handle missing listing
    }
    res.redirect("/listings"); // Redirect to the listings page after deletion
  })
);

module.exports = router; // Export the router for use in other files
