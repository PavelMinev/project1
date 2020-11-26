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
    const product = new Product(title, price, description, imageUrl, null, req.user._id)
    product.save()
        .then(result => {
            console.log('Product Created');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
}

exports.getEditProduct = (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // Template engine on:
    const editMode = !!req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            });
        })
        .catch(err => console.log(err));
    }

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId)
    product.save()
        .then(result => {
            console.log('Product Updated');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(result => {
            console.log('Product Deleted');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', { 
                prods: products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products',
            });
        })
        .catch(err => console.log(err));
}