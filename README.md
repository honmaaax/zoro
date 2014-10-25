# zoro.js

## Getting Started

for server side

```shell
$ npm install zoro
```

for client side

```html
<script src="zoro.js"></script>
```

## Usage

```js
zoro
	.waterfall([
	  [Posts, 'get', 12345]
	  [Authors, 'get']
	])
	.done(function(result){
		console.log(result[0]);
		console.log(result[1]);
	})
	.fail(function(err){
	  concole.log(err);
	});
```

case of express app

```js
var zoro = require('zoro');

var Users = require('users');
var Reviews = require('reviews');

exports.render = function(req, res){
  var id = req.params.id;
  zoro
  	.parallel({
  		user : [Users, 'getById', id],
  		review : [Reviews, 'getByUser', id]
  	})
  	.done(function(result){
  		res.render('user-list', {
  		  page : 'users',
  		  user : result.user,
  		  review : result.review
  		});
  	})
  	.fail(function(err){
  	  concole.log(err);
  	});
};
```

## Feature

* `zoro.waterfall()` has about the same function as async.waterfall()
* `zoro.series()` has about the same function as async.series()
* `zoro.parallel()` has about the same function as async.parallel()
* `zoro.done()` defines a callback function when all async functions success
* `zoro.fail()` defines a callback function when any async functions error
* `zoro.always()` defines a callback function when all async functions finish
* `zoro.bind()` changes context of async functions
