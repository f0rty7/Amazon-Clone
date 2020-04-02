const router = require("express").Router();
// const algoliaSearch = require("algoliasearch");
// const client = algoliaSearch("A5498HIU50", "44e33a8ebb2d8f4fe94451c076a22b38");
// const index = client.initIndex("amazonforty7");
const Product = require("../models/product");

// router.get("/", (req, res, next) => {
//   if (req.query.query) {
//     index.search(
//       {
//         query: req.query.query,
//         page: req.query.page
//       },
//       (error, results) => {
//         res.json({
//           success: true,
//           message: "Successfully got search results",
//           status: 200,
//           content: results,
//           search_results: req.query.query
//         });
//       }
//     );
//   }
// });

router.get("/", (req, res) => {
  console.log(req.body);
  let name = req.query.name;
  var regex = new RegExp(`${name}`, 'i');
  if (!name) {
    return res.json({
      success: false,
      message: "Not found"
    });
  }
  Product.find({ title: regex })

  // Product.find(
  //   {name: { $regex: `${name}`, $options: 'i'}},
  //   "title description price image",
  //   (err, result) => {
  //     if( !err && result){
  //       res.json({
  //         product: result
  //       })
  //     }
  //   }
  //   );

    // .populate("owner")
    // .populate("category")
    // .populate("reviews")
    .exec((error, products) => {
      if (error) {
        res.json({
          success: false,
          message: "Product not found la"
        });
      } else {
        if (products) {
          res.json({
            success: true,
            message: "Search completed successfully",
            product: products
          });
        }
      }
    });
});

module.exports = router;
