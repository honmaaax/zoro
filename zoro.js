var _ = require('lodash');
var async = require('async');

module.exports = {
	init : function(self, funcs){
		self = _.cloneDeep(self);
		self.funcs = funcs;
		return self;
	},
	bind : function(thisArg){
		this._thisArg = thisArg;
		return this;
	},
	done : function(func){
		this._done = _.once(func);
		return this;
	},
	fail : function(func){
		this._fail = _.once(func);
		return this;
	},
	always : function(func){
		this._always = _.once(func);
		return this;
	},
	waterfall : function(funcs){
		var self = new this.init(this, funcs);
		_.defer(function(){
			async.waterfall(self._replace(), self._chainize());
		});
		return self;
	},
	series : function(funcs){
		var self = new this.init(this, funcs);
		_.defer(function(){
			async.series(self._replace(), self._chainize());
		});
		return self;
	},
	parallel : function(funcs){
		var self = new this.init(this, funcs);
		_.defer(function(){
			async.parallel(self._replace(), self._chainize());
		});
		return self;
	},
	_replace : function(){
		var self = this;
		var funcs = self.funcs;
		var results = _.isArray(funcs) ? [] : {};
		_(funcs).forEach(function(func, key){
			var r;
			if( _.isArray(func) ){
				r = function(){
					var args = _.toArray(arguments);
					args = func.slice(2).concat(args);
					func[0][func[1]].apply(self._thisArg || func[0], args);
				};
			} else if( _.isFunction(func) ){
				r = func;
			}
			results[key] = r;
		});
		return results;
	},
	_chainize : function(){
		var self = this;
		return function(err, res){
			if( err!==undefined && err!==null ){
				if(self._fail) self._fail(err);
			} else {
				if(self._done) self._done(res);
			}
			if(self._always) self._always(err, res);
		};
	}
};
