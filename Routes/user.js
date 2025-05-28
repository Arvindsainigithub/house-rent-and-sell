const express = require("express");
const router = express.Router();
const userControler = require("../Contorlers/user");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(userControler.signUp)
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash('success',"Welcom back to NextKey")
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
  }
);

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash('success',"You are logged Out!")
        res.redirect('/listings')
    })
})
module.exports = router;
