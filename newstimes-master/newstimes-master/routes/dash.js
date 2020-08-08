var express = require('express');
var router = express.Router();
//Get Homepage
router.get('/dashboard',ensureAuthenticated,function(req,res){
    console.log("At dash.js");
    res.render('dashboard');
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
         return next();
    }else{
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;