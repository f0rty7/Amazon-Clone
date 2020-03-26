const router = require("express").Router();
const Category = require("../models/category");
const Product = require("../models/product");
const async = require("async");

// Categories api
router
  .route("/categories")
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Successfully got all categories",
        categories: categories
      });
    });
  })
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Category saved successfully"
    });
  });

router.get("/categories/:id", (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    function(callback) {
      Product.countDocuments({ category: req.params.id }, (error, count) => {
        let totalProducts = count;
        callback(error, totalProducts);
      });
    },
    function(callback) {
      Product.find({ category: req.params.id })
        .skip(perPage * page)
        .limit(perPage)
        .populate("category")
        .populate("owner")
        .exec((error, products) => {
          if (error) return next(error);
          callback(error, products);
        });
    },
    function(callback) {
      Category.findOne({ _id: req.params.id }, (error, category) => {
        callback(error, category);
      });
    },
  ],
  function(error, results) {
    var totalProducts = results[0];
    var products = results[1];
    var category = results[2];
    res.json({
      success: true,
      message: "10 items per category found",
      products: products,
      categoryName: category.name,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });
});

module.exports = router;
