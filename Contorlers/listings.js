const Listings = require("../models/Listing");

module.exports.index = async (req, res, next) => {
  const result = await Listings.find({});
  res.render("home.ejs", { result });
};

module.exports.showRoutes = async (req, res) => {
  let { id } = req.params;
  const result = await Listings.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!result) {
    req.flash("error", "Listing Does not Exist");
    res.redirect("/listings");
  }
  console.log(result);
  res.render("show.ejs", { result });
};

module.exports.listingRoutes = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const listings = new Listings(req.body.list);
  listings.owner = req.user._id;
  listings.image = { url, filename };
  await listings.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let result = await Listings.findById(id);
  if (!result) {
    req.flash("error", "Listing Does not Exist");
    res.redirect("/listings");
  }
  req.flash("success", "Listing updated");
  res.render("edit.ejs", { result });
};

module.exports.viewListing = async (req, res) => {
  if (!req.body) {
    throw new expressError(400, "Invalid data");
  }
  let { id } = req.params;
  let listing = await Listings.findByIdAndUpdate(id, { ...req.body.list });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
