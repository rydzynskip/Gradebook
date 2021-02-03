module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log('You must be logged in to see that!!');
        res.redirect('/login');
    }
};