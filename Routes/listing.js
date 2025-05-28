if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync");
const { schema } = require("../sheema");
const expressError = require("../Utils/ExpressError");
const { isLoggedIn, isOwner } = require("../middleware");
const listingControler = require("../Contorlers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const validateList = (req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(401, errMsg);
  } else {
    next();
  }
};

router.get("/new", isLoggedIn, (req, res) => {
  res.render("insert.ejs");
});

router
  .route("/:id")
  .get(wrapAsync(listingControler.showRoutes))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("list[image]"),
    validateList,
    wrapAsync(listingControler.viewListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControler.deleteListing));

router
  .route("/")
  .post(
    isLoggedIn,
    upload.single("list[image]"),
    validateList,
    wrapAsync(listingControler.listingRoutes)
  )
  .get(wrapAsync(listingControler.index));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControler.editListing)
);

module.exports = router;
