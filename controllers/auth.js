const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const cookiesObj = {};
    // req.get('Cookie').split(';').forEach(x => {
    //     const lin = x.trim().split('=');
    //     cookiesObj[lin[0]] = lin[1];
    // });
    // const isLoggedIn = cookiesObj['loggedIn'] === 'true';
    const isLoggedIn = false;
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findById('5fd7ade35bf10a2760784413')
    .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};
