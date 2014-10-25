var _ = require('lodash');
var async = require('async');

module.exports = {
	bind : function(thisArg){
		this._thisArg = thisArg;
		return this;
	},
	done : function(func){
		this._done = func;
		return this;
	},
	fail : function(func){
		this._fail = func;
		return this;
	},
	always : function(func){
		this._always = func;
		return this;
	},
	waterfall : function(funcs){
		async.waterfall(this._replace(funcs), this._chainize(this));
		return this;
	},
	series : function(funcs){
		async.series(this._replace(funcs), this._chainize(this));
		return this;
	},
	parallel : function(funcs){
		async.parallel(this._replace(funcs), this._chainize(this));
		return this;
	},
	_replace : function(funcs){
		var self = this;
		return funcs.map(function(func){
			var r;
			if( _.isArray(func) ){
				r = function(){
					var args = _.toArray(arguments);
					if( args.length===1 ){
						args = func.slice(2).concat(args);
					}
					func[0][func[1]].apply(self._thisArg || func[0], args);
				};
			} else if( _.isFunction(func) ){
				r = func;
			}
			return r;
		});
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
