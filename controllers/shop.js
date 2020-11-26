const Product = require('../models/product');

exports.getProducts = (req, res) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // template engine on:
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: 'All Products', 
                path: '/products',
            });
        })
        .catch(err => console.log(err));
}

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', { 
                product: product, 
                pageTitle: `Product Detail - ${product.title}`, 
                path: '/products',
            });
        }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', { 
                prods: products, 
                pageTitle: 'Shop', 
                path: '/',
            });
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', { 
                pageTitle: 'Your Cart', 
                path: '/cart',
                products
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        }).then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', { 
                pageTitle: 'Your Orders', 
                path: '/orders',
                orders,
            });
        })
        .catch(err => console.log(err));
}
