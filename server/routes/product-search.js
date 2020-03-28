const router = require("express").Router();
const algoliaSearch = require("algoliasearch");
const client = algoliaSearch("A5498HIU50", "44e33a8ebb2d8f4fe94451c076a22b38");
const index = client.initIndex("amazonforty7");

router.get("/", (req, res, next) => {
  if (req.query.query) {
    index.search(
      {
        query: req.query.query,
        page: req.query.page
      },
      (error, results) => {
        res.json({
          success: true,
          message: "Successfully got search results",
          status: 200,
          content: results,
          search_results: req.query.query
        });
      }
    );
  }
});

module.exports = router;
