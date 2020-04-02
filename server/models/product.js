const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const deepPopulate = require("mongoose-deep-populate")(mongoose);
// const mongooseAlgolia = require("mongoose-algolia");

const productSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    image: String,
    title: String,
    description: String,
    price: Number,
    created: { type: Date, default: Date.now() }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

productSchema.virtual("averageRating").get(function() {
  var rating = 0;
  if (this.reviews.length == 0) {
    rating = 0;
  } else {
    this.reviews.map(review => {
      rating += review.rating;
    });
    rating /= this.reviews.length;
  }
  return rating;
});

productSchema.plugin(deepPopulate);
// productSchema.plugin(mongooseAlgolia, {
//   appId: "A5498HIU50",
//   apiKey: "44e33a8ebb2d8f4fe94451c076a22b38",
//   indexName: "amazonforty7",
//   selector: "_id title image reviews description price owner created averageRating",
//   populate: {
//     path: "owner reviews",
//     select: "name rating"
//   },
//   defaults: {
//     author: "Hem"
//   },
//   mappings: {
//     title: function(value) {
//       return `${value}`;
//     }
//   },
//   // virtuals: {
//   //   averageRating: function(doc) {
//   //     var rating = 0;
//   //     if (doc.reviews.length == 0) {
//   //       rating = 0;
//   //     } else {
//   //       doc.reviews.map(review => {
//   //         rating += review.rating;
//   //       });
//   //       rating /= doc.reviews.length;
//   //     }
//   //     return rating;
//   //   }
//   // },
//   debug: true,
// });

let Model = mongoose.model("Product", productSchema);
// Model.SyncToAlgolia();
// Model.SetAlgoliaSettings({
//   searchableAttributes: ['title']
// });

module.exports = Model;
