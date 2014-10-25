var _ = require('lodash');
var expect = require('chai').expect;

var zoro = require('../index');



var testA = {
	num : 0,
	funcA : function(arg, next){
		next(null, this.num + arg + 3);
	},
	funcB : function(arg, next){
		next('message');
	},
	funcC : function(arg, next){
		next(null, arg + 1, arg * 2);
	},
	funcD : function(argA, argB, argC, next){
		next(null, argA + argB + argC);
	},
	funcE : function(arg, next){
		setTimeout(function(){
			next(null, arg + 3);
		}, 10);
	},
	funcF : function(arg, next){
		next(null, arg + 4);
	}
};
var testB = _.extend({}, testA, {
	num : 1
});

describe('waterfall, series, parallel', function(){
    it('should define by array in array', function(done){
		zoro
			.parallel([
				[testA, 'funcA', 2]
			])
			.done(function(res){
				expect(res[0]).to.equal(5);
				done();
			});
	});
    it('should define by array in arrays', function(done){
		zoro
			.parallel([
				[testA, 'funcA', 2],
				[testB, 'funcA', 5]
			])
			.done(function(res){
				expect(res[0]).to.equal(5);
				expect(res[1]).to.equal(9);
				done();
			});
	});
    it('should define by array in object', function(done){
		zoro
			.parallel({
				objA : [testA, 'funcA', 2]
			})
			.done(function(res){
				expect(res.objA).to.equal(5);
				done();
			});
	});
    it('should define by array in objects', function(done){
		zoro
			.parallel({
				objA : [testA, 'funcA', 2],
				objB : [testA, 'funcA', 5]
			})
			.done(function(res){
				expect(res.objA).to.equal(5);
				expect(res.objB).to.equal(8);
				done();
			});
	});
});
describe('fail', function(){
    it('should return an error to fail method', function(done){
		zoro
			.parallel([
				[testA, 'funcB', 2]
			])
			.fail(function(err){
				expect(err).to.equal('message');
				done();
			});
	});
});
describe('always', function(){
    it('should return arguments to always method when function successes', function(done){
		zoro
			.parallel([
				[testA, 'funcA', 2]
			])
			.always(function(err, res){
				expect(res[0]).to.equal(5);
				done();
			});
	});
    it('should return an error to always method when function errors', function(done){
		zoro
			.parallel([
				[testA, 'funcB', 2]
			])
			.always(function(err, res){
				expect(err).to.equal('message');
				done();
			});
	});
});
describe('bind', function(){
    it('should change context', function(done){
		zoro
			.parallel([
				[testA, 'funcA', 2]
			])
			.bind(testB)
			.done(function(res){
				expect(res[0]).to.equal(6);
				done();
			});
	});
    it('should also change context when bind method is defined already', function(done){
		zoro.bind(testB)
			.parallel([
				[testA, 'funcA', 2]
			])
			.done(function(res){
				expect(res[0]).to.equal(6);
				done();
			});
	});
});

describe('waterfall', function(){
    it('should run in the same way as async', function(done){
		zoro
			.waterfall([
				[testA, 'funcC', 2],
				[testA, 'funcD', 3]
			])
			.done(function(res){
				expect(res).to.equal(10);
				done();
			});
	});
    it('should run async in the same way as async', function(done){
		zoro
			.waterfall([
				[testA, 'funcE', 1],
				[testA, 'funcF']
			])
			.done(function(res){
				expect(res).to.equal(8);
				done();
			});
	});
});

describe('series', function(){
    it('should run in the same way as async', function(done){
		zoro
			.series([
				[testA, 'funcE', 2],
				[testA, 'funcF', 3]
			])
			.done(function(res){
				expect(res[0]).to.equal(5);
				expect(res[1]).to.equal(7);
				done();
			});
	});
    it('should run async in the same way as async', function(done){
		zoro
			.series([
				[testA, 'funcE', 5],
				[testA, 'funcF', 1]
			])
			.done(function(res){
				expect(res[0]).to.equal(8);
				expect(res[1]).to.equal(5);
				done();
			});
	});
});
