const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    image: {
        url: {
            type: String,
            default: "https://tse2.mm.bing.net/th?id=OIP.CMpr4Uy-D7Zg1WTtK6ni_QHaE8&pid=Api&P=0&h=180",
            set: (v) => 
                v === "" 
                    ? "https://tse2.mm.bing.net/th?id=OIP.CMpr4Uy-D7Zg1WTtK6ni_QHaE8&pid=Api&P=0&h=180"
                    : v
            
        }
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;