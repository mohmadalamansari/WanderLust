const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

const initdb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data); 
    console.log("data was initialized");
};

initdb();
