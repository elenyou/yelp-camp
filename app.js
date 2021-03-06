const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const cookieParser = require("cookie-parser");
const flash          = require("connect-flash");
const passport       = require('passport');
const session        = require("express-session");
const LocalStrategy  = require('passport-local');
const moment         = require("moment");
const methodOverride = require('method-override');
const Campground     = require('./models/campground');
const Comment        = require('./models/comment');
const User           = require('./models/user');


//requiring routes
const commentRoutes      = require("./routes/comments"),
      campgroundRoutes   = require("./routes/campgrounds"),
      indexRoutes        = require("./routes/index")

// const seedDB         = require('./seeds');
// seedDB();
mongoose.connect('mongodb+srv://elen:070331mdb!@cluster0-drqh7.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment; // create local variable available for the application
mongoose.set('useFindAndModify', false);
app.use(cookieParser('secret'));


//Passport config
app.use(session({
    secret: "Avengers!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000,  () => {
    console.log('Ready!');
});
