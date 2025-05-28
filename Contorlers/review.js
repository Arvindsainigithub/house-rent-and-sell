const Review = require('../models/review')
const List =require('../models/Listing')

module.exports.reviewPost=async (req, res) => {
    let listing = await List.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id
    listing.reviews.push(newReview);
    listing.save();
    newReview.save();
    req.flash("success", "Review Created");
    res.redirect(`/listings/${listing.id}`);
  }

  module.exports.reviewDelete=async (req, res) => {
      let { id, reviewId } = req.params;
      await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    }