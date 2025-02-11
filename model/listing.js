const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");


const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1500622944204-b135684e99fd?q=80&w=1161&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1500622944204-b135684e99fd?q=80&w=1161&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v.url || v,
  },
  price: {
    type: Number,
    required: true, 
    default: 0 
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  review:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }]
});

listingSchema.post("findOneAndDelete" ,async(Listing)=>{
  if(Listing){
    await review.deleteMany({_id :{$in : Listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
