

/**
* Initialize abstract `Store`.
*
* @api private
*/

const utils = require('util'),
	_ = require('underscore');

var Store = module.exports = function Store(){};

Store.prototype.setLang = function(req, fn) {
	var name = [];
	
	if( _.isString(req.query[this.settings.query] ) ){
		name.push( req.query[this.settings.query].toLowerCase().substring(0,2) );
		name.push( req.query[this.settings.query].toLowerCase() );
	}
	
	var header = req.acceptsLanguages().reverse();
	
	for (var i = header.length - 1; i >= 0; i--){
		name.push(  header[i].toLowerCase().substring(0,2) );
		name.push(  header[i].toLowerCase() );
	}
	
	name.push( this.settings[ 'default Lang' ] );

	if( !_.isFunction(this.get))
		return fn(new Error('No exist get the lang use store.get'));

	this.getLang(name, fn);
};

/**
* Initialize abstract `Store`.
*
* @api 
*/

Store.prototype.translate = function(lang) {
	return function () {
		var args = Array.prototype.slice.call(arguments);
		args[0] = lang[ args[0] ] || args[0];
		return utils.format.apply(this, args);
	};
};

Store.prototype.__set = function(key, name) {
	this.settings[key] = name;
};

