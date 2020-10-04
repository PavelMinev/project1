const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // Template engine on:
    res.render('admin/add-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formCSS: true, 
        productCSS: true, 
        activeAddProduct: true
    });
}

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        });
    });
}