// Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const port = process.env.PORT || 4000;
const favicon = require("serve-favicon");
const cors = require("cors");

// Database connection
const dbUrl = "mongodb://localhost:27017/Amazon";

mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  error => {
    if (error) {
      console.log("Connection to Databse failed");
      console.log(error);
    } else {
      console.log("Database connected");
    }
  }
);

// server favicon.ico
app.use(favicon(path.join(__dirname, "public", "forty7.ico")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const userRoutes = require("./routes/account");
const mainRoutes = require("./routes/main");
const sellerRoutes = require("./routes/seller");
const productSearchRoutes = require("./routes/product-search");

app.use("/api", mainRoutes);
app.use("/api/search", productSearchRoutes);
app.use("/api/accounts", userRoutes);
app.use("/api/seller", sellerRoutes);

app.listen(port, () => {
  console.log("Server running on port ==> " + port);
});
