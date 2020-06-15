const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // Template engine on:
    res.render('add-product', {docTitle: 'Add Product', path: '/admin/add-product', formCSS: true, productCSS: true, activeAddProduct: true});
});

router.post('/add-product', (req, res) => {
    products.push({title: req.body.title});
    res.redirect('/');
})

// module.exports = router;
exports.routes = router;
exports.products = products;