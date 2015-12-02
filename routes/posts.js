var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next){
	var categories = db.get('categories');

	categories.find({},{},function(err, categories){
		// console.log(categories);

		res.render('addpost',{
		"title":"Add Post",
		"categories": categories
		});
	});
});

router.post('/add', function(req, res, next){
	// GET FORM VALUES
	var title 		= req.body.title;
	var category 	= req.body.category;
	var body 		= req.body.body;
	var author 		= req.body.author;
	var date 		= new Date();

	// console.log(req.file);
	console.log(req.file)
	if(req.file){
		var mainImageOriginalName 	= req.file.mainimage.originalname;
		var mainImageName 			= req.file.mainimage.filename;
		var mainImageMime 			= req.file.mainimage.mimetype;
		var mainImagePath 			= req.file.mainimage.path;
		var mainImageExt 			= req.file.mainimage.extension;
		var mainImageSize 			= req.file.mainimage.size;
		// console.log(mainImageName);
	} else{
		var mainImageName = 'noimage.png';
		console.log(mainImageName);
	}

	// FORM VALIDATION
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body','Body field is required');

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors":errors,
			"title":title,
			"body":body
		});
	} else {
		var posts = db.get('posts');

		// SUBMIT TO DB
		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainimage":mainImageName
		}, function(err, post){
			if(err){
				res.send('There is an issue submiting the post');
			} else {
				req.flash('Success','Post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;