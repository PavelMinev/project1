const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// // Handlebars template engine
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

// // Handlebars
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5fd7ade35bf10a2760784413')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/favicon.ico', (req, res, next) => {
    res.send('No favicon');
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        'mongodb+srv://admin:9650276711_M@shop.ub09e.mongodb.net/shop?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        console.log('Application is running on http://localhost:3000')
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Paul',
                    email: 'mpl12@rambler.ru',
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
