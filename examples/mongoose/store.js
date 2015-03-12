const util = require( process.binding('natives').util ? 'util' : 'sys');
const _ = require('underscore');
var lang = require('../lib');
var mongo = require('mongoose');

var ObjectId= mongo.Schema.Types.ObjectId;
var Mixed	= mongo.Schema.Types.Mixed;
var langSchema = new mongo.Schema({
	name	: { type : String, trim : true, unique : true },
	code	: { type : String, match : /^[a-z]{2}$/, lowercase : true, trim : true, index : true, unique : true },
	keys	: Mixed,
	extend	: { type : ObjectId, ref: 'lang' },
});

var translate = function(url) {
	mongo.connect(url);
	this.model = mongo.model('lang', langSchema);
	lang.Store.call(this, {});
};

util.inherits(translate,  lang.Store);

translate.prototype.getLang = function (langs, fn) {
	var list = [ ];
	for (var i = langs.length - 1; i >= 0; i--)
		if(langs[i]) list.push( { code : langs[i] });

	this.model.findOne({ 
		public : true, 
		$or : list.reverse() 
	}).populate('extend').exec(function (err, doc) {
		if(err || !doc) return fn(err);
		fn(err, _.defaults( doc.keys, doc.extends.key || {}));
	});
};

translate.prototype.listLang = function(fn) {
	this.model.find().select('-keys').exec(fn);
};

module.exports = translate;
