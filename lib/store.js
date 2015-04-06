

/**
* Initialize abstract `Store`.
*
* @api private
*/

const utils = require('util'),
	_ = require('underscore');

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
		if( _.isArray(msgid) ){
			msgid = _.compact(msgid);
			args[0] = msgid[0];
			if(msgid.length > 1 && _.isNumber(args[1]) ){
				for (var i = 0; i < msgid.length; i++) {
					if( i <= args[1] )
						args[0] = msgid[i];
				}
			}
		}

		return utils.format.apply(this, args);
	};
};

Store.prototype.__set = function(key, name) {
	this.settings[key] = name;
};

module.exports = Store;