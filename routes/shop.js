const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // template engine on:
    const products = adminData.products;
    res.render('shop', { 
        prods: products, 
        docTitle: 'Shop', 
        path: '/', 
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        // layout: false, // Handlebars special keyword - not to use default layout
    });
});

module.exports = router;