const router = require("express").Router();
const Category = require("../models/category");
const Product = require("../models/product");
const Review = require("../models/review");
const Order = require("../models/order");
const checkJWT = require("../middlewares/jwt-check");
const async = require("async");
const stripe = require("stripe")("sk_test_Hgr5uBg9pixgM8MMHuNm9Jb700A639XAUy");

// Categories api
router
  .route("/categories")
  .get((req, res, next) => {
    console.log(req.body);
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Successfully got all categories",
        categories: categories
      });
    });
  })
  .post((req, res, next) => {
    console.log(req.body);
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Category saved successfully"
    });
  });

router.get("/products", (req, res, next) => {
  console.log(req.body);
  const perPage = 10;
  const page = req.query.page;

  async.parallel(
    [
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
      }
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
    }
  );
});

router.get("/categories/:id", (req, res, next) => {
  console.log(req.body);
  const perPage = 10;
  const page = req.query.page;
  async.parallel(
    [
      function(callback) {
        Product.count({ category: req.params.id }, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({ category: req.params.id })
          .skip(perPage * page)
          .limit(perPage)
          .populate("category")
          .populate("owner")
          .populate("review")
          .exec((err, products) => {
            if (err) return next(err);
            callback(err, products);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
          callback(err, category);
        });
      }
    ],
    function(err, results) {
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: "category",
        products: products,
        categoryName: category.name,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage)
      });
    }
  );
});

router.get("/product/:id", (req, res, next) => {
  console.log(req.body);
  Product.findById({ _id: req.params.id })
    .populate("category")
    .populate("owner")
    .deepPopulate("reviews.owner")
    .exec((error, product) => {
      if (error) {
        res.json({
          success: false,
          message: "Product not found"
        });
      } else {
        if (product) {
          res.json({
            success: true,
            message: "Product found",
            product: product
          });
        }
      }
    });
});

router.post("/review", checkJWT, (req, res, next) => {
  console.log(req.body);
  async.waterfall([
    function(callback) {
      Product.findOne({ _id: req.body.productId }, (error, product) => {
        if (product) {
          callback(error, product);
        }
      });
    },
    function(product) {
      let review = new Review();
      review.owner = req.decoded.user._id;
      if (req.body.title) review.title = req.body.title;
      if (req.body.description) review.description = req.body.description;
      if (req.body.rating) review.rating = req.body.rating;

      product.reviews.push(review._id);
      product.save();
      review.save();
      res.json({
        success: true,
        message: "Successfully added the review"
      });
    }
  ]);
});

router.post("/payment", checkJWT, (req, res, next) => {
  const stripeToken = req.body.stripeToken;
  const currentCharges = Math.round(req.body.totalPrice * 100);

  stripe.customers
    .create({ source: stripeToken.id })
    .then((
      customer //.then(function(customer){});
    ) =>
      stripe.charges.create({
        amount: currentCharges * 100,
        currency: "usd",
        customer: customer.id
      })
    )
    .then(charge => {
      const products = req.body.products;

      let order = new Order();
      order.owner = req.decoded.user._id;
      order.totalPrice = currentCharges;

      products.map(product => {
        order.products.push({
          product: product.product,
          quantity: product.quantity
        });
      });

      order.save();
      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    });
});

module.exports = router;
