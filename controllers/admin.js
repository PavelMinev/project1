const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // Template engine on:
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false,
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

exports.getEditProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // Template engine on:
    const editMode = !!req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    })
}

exports.postEditProduct = (req, res, next) => {
    console.log('READY TO 126 lesson')
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