const User = require("../models/user");

module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash('success',"Welcom to NextKey")
        res.redirect('/listings')
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  };