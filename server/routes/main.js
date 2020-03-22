const router = require("express").Router();
const Category = require("../models/category");


router
  .route("/categories")
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: 'Successfully got categories',
        category: categories
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

module.exports = router;
