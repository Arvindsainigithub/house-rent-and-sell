const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync");
const { reviewSchema } = require("../sheema");
const expressError = require("../Utils/ExpressError");
const { isLoggedIn, isAuthor } = require("../middleware");
const reviewControler = require("../Contorlers/review");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(401, errMsg);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControler.reviewPost)
);
// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewControler.reviewDelete)
);

module.exports = router;
