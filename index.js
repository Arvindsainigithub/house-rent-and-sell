const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const override = require("method-override");
const expressError = require("./Utils/ExpressError");
const listingRouter = require("./Routes/listing");
const userRouter = require("./Routes/user")
const reviewRouter = require("./Routes/review");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const flash = require("connect-flash");
const passport = require('passport')
const LocalSrategy = require('passport-local')
const User = require('./models/user')
app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(override("_method"));
app.engine("ejs", ejsMate);
require("dotenv").config();
const port = process.env.PORT || 3000;
const dbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret :process.env.SECRET
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("You are at home page");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error=req.flash('error')
  res.locals.currUser=req.user;
  next();
});


app.listen(port, () => {
  console.log(`Your Server is ${port}`);
});

// app.use('/',userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 401, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

const dbConnection = require("./DB/dbConnection");
dbConnection();
