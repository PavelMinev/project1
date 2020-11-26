const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cart = this.cart || {items: []};
        const cartProductIndex = cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(x => x.productId);
        return db
            .collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => products.map(p => ({
                ...p, 
                quantity: this.cart.items.find(cp => cp.productId.toString() === p._id.toString()).quantity
            })))
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(cp => cp.productId.toString() !== productId.toString());
        const db = getDb();
        const updatedCart = {items: updatedCartItems};
        return db
            .collection('users')
            .updateOne(
                { _id: ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                    }
                };
                return db
                    .collection('orders')
                    .insertOne(order)
            }).then(result => {
                    this.cart = {items: []};
                    return db
                        .collection('users')
                        .updateOne(
                            { _id: ObjectId(this._id) },
                            { $set: { cart: { items: [] } } }
                        );
                });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({_id: new ObjectId(userId)});
    }
}

module.exports = User;