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

router.get("/products", (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    function(callback) {
      Product.countDocuments({}, (error, count) => {
        var totalProducts = count;
        callback(error, totalProducts);
      });
    },
    function(callback) {
      Product.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate("category")
        .populate("owner")
        .exec((error, products) => {
          if (error) return next(error);
          callback(error, products);
        });
    },
    // function(callback) {
    //   Category.findOne({ _id: req.params.id }, (error, category) => {
    //     callback(error, category);
    //   });
    // },
  ],
  function(error, results) {
    var totalProducts = results[0];
    var products = results[1];
    // var category = results[2];
    res.json({
      success: true,
      message: "10 items per category found",
      products: products,
      // categoryName: category.name,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });
});

router.get('/categories/:id', (req,res,next)=>{
  const perPage = 10;
  const page = req.query.page ;
  async.parallel([
      function(callback) {
          Product.count({ category: req.params.id }, (err, count)=>{
              var totalProducts = count;
              callback(err, totalProducts);
          });
      },
      function(callback) {
          Product.find({ category:req.params.id })
              .skip(perPage * page)
              .limit(perPage)
              .populate('category')
              .populate('owner')
              .populate('review')
              .exec((err, products) => {
                  if(err) return next(err);
                  callback(err, products);
              });
      },
      function(callback) {
          Category.findOne({ _id: req.params.id }, (err, category) =>{
          callback(err , category);
          });
      }
  ], function(err, results){
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
          success: true,
          message: "category",
          products: products,
          categoryName: category.name,
          totalProducts: totalProducts,
          pages: Math.ceil(totalProducts/perPage)
      });
  });
});

router.get('/product/:id', ( req, res, next) => {
  Product.findById({ _id : req.params.id})
  .populate("category")
  .populate("owner")
  .exec( (error, product) => {
    if (error) {
      res.json({
        success: false,
        message: "Product not found"
      });
    }
    else {
      if (product) {
        res.json({
          success: true,
          message: "Product found",
          product: product
        });
      }
    }
  });
})

module.exports = router;
