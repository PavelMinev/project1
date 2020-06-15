const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// // Handlebars template engine
// const expressHbs = require('express-handlebars');

const app = express();

// // Handlebars
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/favicon.ico', (req, res, next) => {
    res.send('No favicon');
});

app.use('/admin', adminData.routes);

app.use(shopRoutes);

app.use((req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {docTitle: 'Page Not Found', path: '/not-found'});
});

app.listen(3000);
console.log('App is listening on http://localhost:3000')