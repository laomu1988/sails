// NOTE:
//
// It's stupid that classic MVC frameworks only provide a validation API
// at the model layer.  API parameters need love too!  Validation should be
// provided at the controller layer.
// 
// It is also arguable that the view layer should contain validation for the 
// data coming back over from the controller.
// 
// Optionally identify the controller here
// Otherwise name will be based off of filename
// CASE-INSENSITIVE
//exports.id = 'meta'

exports.home = function (req, res, next ) {
	res.render('index', {
		title: 'crud.io'
	});
}

exports.error = function (req, res, next ) {
	res.render('index', {
		title: 'Error (500) | crud.io'
	});
}

exports.notfound = function (req, res, next ) {
	res.render('index', {
		title: 'Not Found (404) | crud.io'
	});
}
