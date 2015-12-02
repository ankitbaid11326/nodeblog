var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

// Homepage Blog Posts
router.get('/add', function(req, res, next) {
  res.render('addcategory',{
  	"title":"Add Category"
  });
});

router.post('/add', function(req, res, next){
	// GET FORM VALUES
	var title 		= req.body.title;

	// FORM VALIDATION
	req.checkBody('title','Title field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategory',{
			"errors":errors,
			"title":title
		});
	} else {
		var categories = db.get('categories');

		// SUBMIT TO DB
		categories.insert({
			"title":title
		}, function(err, category){
			if(err){
				res.send('There is an issue submiting the category');
			} else {
				req.flash('Success','category submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
 