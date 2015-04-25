

/**
* Initialize abstract `Store`.
*
* @api private
*/

const utils = require('util'),
	_ = require('underscore'),
	format = require('format');

function Store (opts){
	this.settings = _.isObject(opts) ? opts : {};
};

Store.prototype.setLang = function(req, fn) {
	var name = [];

	if( _.isString(req.query[this.settings.query] ) ){
		name.push( req.query[this.settings.query].toLowerCase().replace('_', '-') );
		name.push( req.query[this.settings.query].toLowerCase().substring(0,2) );
	}
	
	if(req.session[this.settings.session])
		name.push(req.session[ this.settings.session ]);

	var header = req.acceptsLanguages().reverse();
	
	for (var i = header.length - 1; i >= 0; i--){
		name.push( header[i].toLowerCase().replace('_', '-') );
		name.push( header[i].toLowerCase().substring(0,2) );
	}
	
	name.push( this.settings[ 'default Lang' ] );

	this.getLang(name, fn);
};

/**
* Initialize abstract `Store`.
*
* @api 
*/

Store.prototype.translate = function (lang) {
	return function () { // tag, number || string, string, string, string
		var args = Array.prototype.slice.call(arguments);
		var msgid = lang[ args[0] ] || args[0];
		delete args[0];
		args = _.compact(args);

		if( _.isArray(msgid) ){
			msgid = _.compact(msgid);
			var z = msgid[0];
			if(msgid.length > 1 && _.isNumber(args[0]) ){
				for (var i = 0; i < msgid.length; i++) {
					if( i <= args[0] )
						z = msgid[i];
				}
			}
			msgid = z;
		}
		
		return format.vsprintf(msgid, args );
	};
};

Store.prototype.__set = function(key, name) {
	this.settings[key] = name;
};

module.exports = Store;