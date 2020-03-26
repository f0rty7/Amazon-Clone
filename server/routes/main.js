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
        message: 'Successfully got all categories',
        categories: categories
      });
    })
  })
  .post(( req, res, next ) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Category saved successfully"
    });
  });

router.get('/categories/:id', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.waterfall([
    function(callback){
      Product.countDocuments({ category: req.params.id}, ( error, count ) => {
        let totalProducts = count;
        callback(error, totalProducts);
      });
    },
    function(totalProducts, callback){
      Product.find({ category: req.params.id })
      .skip( perPage * page )
      .limit(perPage)
      .populate('category')
      .populate('owner')
      .exec((error, products) => {
        if(error) return next(error);
        callback(error,products, totalProducts)
      });
    },
    function(products, totalProducts, callback){
      Category.findOne({ _id: req.params.id }, ( error, category) => {
        res.json({
          success: true,
          message: '10 items per category found',
          products: products,
          categoryName: category.name,
          totalProducts: totalProducts,
          pages: Math.ceil(totalProducts / perPage)
        });
      });
    }
  ]);
})

module.exports = router;
