const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// // Handlebars template engine
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://admin:9650276711_M@shop.ub09e.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    // expires: ''
});

const csrfProtection = csrf();

// // Handlebars
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: '31vj2k154br1dvk413j5hbjv_QE$',
        resave: false, 
        saveUninitialized: false,
        store: store,
        // cookie: {maxAge: 60 * 60 * 24},
    })
);
app.use(csrfProtection);
app.use(flash());

app.use('/favicon.ico', (req, res, next) => {
    res.send('No favicon');
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((err, req, res, next) => {
    // res.status(error.httpStatusCode).render(...)
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

mongoose
    .connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        console.log('Application is running on http://localhost:3000')
        // User.findOne().then(user => {
        //     if (!user) {
        //         const user = new User({
        //             name: 'Paul',
        //             email: 'mpl12@rambler.ru',
        //             cart: {
        //                 items: [],
        //             },
        //         });
        //         user.save();
        //     }
        // });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
