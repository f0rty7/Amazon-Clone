const router = require("express").Router();
const Product = require("../models/product");

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({
  accessKeyId: "AKIAQNVHKZBUJ42Z6UNO",
  secretAccessKey: "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"
});
const checkJWT = require("../middlewares/jwt-check");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "amazonforty7",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldName });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

router
  .route("/products")
  .get( checkJWT, (req, res, next) => {
    console.log(req.body);
    Product.find({ owner: req.decoded.user._id})
    .populate('owner')
    .populate('category')
    .exec( (error, products) => {
      if(products){
        res.json({
          success: true,
          message: 'Successfully got product information',
          products: products
        });
      }
    })
  })
  // .post([ checkJWT, upload.single('product_picture')], (req, res, next) => {
  .post([ checkJWT ], (req, res, next) => {
    console.log(req.body);
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    // product.image = req.file.location;
    product.image = 'no-image';
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.save();
    res.json({
      success: true,
      message: "Successfully added product"
    });
  });

module.exports = router;
