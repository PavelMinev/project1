const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// // Handlebars template engine
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

// // Handlebars
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5fbfc1a4ca1c2748e475a2d3')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
            next();
        });
});

app.use('/favicon.ico', (req, res, next) => {
    res.send('No favicon');
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
    console.log('App is available on http://localhost:3000');
});
