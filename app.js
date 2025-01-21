const express = require("express");
// require('express-async-errors');
const mongoose = require("mongoose");
const Listing = require("./model/listing"); // Import the Mongoose model for listings
const methodOverride = require("method-override"); // Middleware to support HTTP verbs like PUT and DELETE in forms
const ejsMate = require("ejs-mate"); // EJS layout engine to manage templates
const wrapAsync = require("./utils/wrapasync"); // Utility function to catch async errors
const ExpressError = require("./utils/ExpressError"); // Custom error handler class
const { listingSchema } = require("./schema"); // Validation schema for listings

const path = require("path"); // Node.js module for handling file paths
const app = express();

// Set view engine and views directory
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms
app.use(express.json()); // Parse JSON data from requests
app.use(methodOverride("_method")); // Override HTTP methods using a query parameter (_method)
app.engine("ejs", ejsMate); // Use ejs-mate as the template engine
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files from "public" folder

const port = 3000;

// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

main()
  .then(() => console.log("Connected to database")) // Log success message if connected
  .catch((err) => console.log(err)); // Log error if connection fails

// Root route - Redirects to the listings page
app.get("/", (req, res) => {
  res.redirect("/listings");
  // res.send("all good")
});

// Index Route - Lists all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}); // Fetch all listings from the database
  res.render("listing/index", { allListings }); // Render the "index" template with the listings data
}));

// New Route - Displays a form for creating a new listing
app.get("/listing/new", wrapAsync((req, res) => {
  res.render("listing/new"); // Render the "new" template for adding a listing
}));

// Show Route - Displays details of a specific listing
app.get("/listing/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params; // Extract the ID from request parameters
  const listing = await Listing.findById(id); // Find the listing by ID
  if (!listing) {
    return next(new ExpressError(404, "Listing not found")); // Handle missing listing
  }
  res.render("listing/show", { listing }); // Render the "show" template with the listing data
}));

// Create Route - Adds a new listing to the database
app.post("/listing", wrapAsync(async (req, res) => {
  let {result}  
  const newListing = new Listing(req.body.listing); // Create a new listing
  await newListing.save(); // Save the listing to the database
  res.redirect("/listings"); // Redirect to the index route after saving
}));

// Edit Route - Displays a form for editing an existing listing
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
  const { id } = req.params; // Extract the ID from request parameters
  const listing = await Listing.findById(id); // Find the listing by ID
  if (!listing) {
    return next(new ExpressError(404, "Listing not found")); // Handle missing listing
  }
  res.render("listing/edit", { listing }); // Render the "edit" template with the listing data
}));

// Update Route - Updates an existing listing in the database
app.put("/listings/:id", wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Send valid data for listing")); // Error if no data is provided
  }
  const { id } = req.params; // Extract the ID from request parameters
  const updatedListing = req.body.listing; // Extract updated data from request body
  const listing = await Listing.findByIdAndUpdate(id, updatedListing, { new: true }); // Update listing in the database
  if (!listing) {
    return next(new ExpressError(404, "Listing not found for update")); // Handle missing listing
  }
  res.redirect(`/listing/${id}`); // Redirect to the show route for the updated listing
}));

// Delete Route - Deletes a listing from the database
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing by ID
  if (!deletedListing) {
    return next(new ExpressError(404, "Listing not found for deletion")); // Handle missing listing
  }
  res.redirect("/listings"); // Redirect to the listings page after deletion
}));


// app.get("/testlisting",(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1300,
//         location:"calangute,goa",
//         country:"india"
//     });
//     sampleListing.save().then(()=>{
//         console.log("data sav eto db")
//     }).catch((err)=>{
//         console.log(err)
//     })
//     console.log("sample was save ");
//     res.send("sucessfully testing ")
//  })


// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found. Please check the URL.")); // Pass error to the error handler
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Avoid sending headers twice
  }
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { err }); // Render error page
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App is listening at port ${port}`); // Log message when the server starts
});
