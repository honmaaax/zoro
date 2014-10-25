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
