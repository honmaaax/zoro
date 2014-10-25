var _ = require('lodash');
var async = require('async');

module.exports = {
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
	unset : function(){
		this._done = undefined;
		this._fail = undefined;
		this._always = undefined;
		return this;
	},
	waterfall : function(funcs){
		_.defer(function(self){
			async.waterfall(self._replace(funcs), self._chainize(self));
			self.bind(undefined);
		}, this);
		this.unset();
		return this;
	},
	series : function(funcs){
		_.defer(function(self){
			async.series(self._replace(funcs), self._chainize(self));
			self.bind(undefined);
		}, this);
		this.unset();
		return this;
	},
	parallel : function(funcs){
		_.defer(function(self){
			async.parallel(self._replace(funcs), self._chainize(self));
			self.bind(undefined);
		}, this);
		this.unset();
		return this;
	},
	_replace : function(funcs){
		var self = this;
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
	_chainize : function(self){
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
