const url = 'mongo://localhost:2017/myDB';
const _ = require('underscore');
var mongo = require('mongoose');

var ObjectId= mongo.Schema.Types.ObjectId;
var Mixed	= mongo.Schema.Types.Mixed;
var langSchema = new mongo.Schema({
	name	: { type : String, trim : true, unique : true },
	code	: { type : String, match : /^[a-z]{2}$/, lowercase : true, trim : true, index : true, unique : true },
	keys	: Mixed,
	extend	: { type : ObjectId, ref: 'lang' },
});
mongo.connect(url);
var model = mongo.model('lang', langSchema);

module.exports.getLang = function (langs, fn) {
	var list = [ ];
	for (var i = langs.length - 1; i >= 0; i--)
		if(langs[i]) list.push({ code : langs[i] });

	model.findOne({ 
		$or : list.reverse()
	}).populate('extend').exec(function (err, doc) {
		if(err || !doc)
			return fn(err);
		var data = doc.keys;
		for (var i = doc.extend.length - 1; i >= 0; i--)
			data = _.defaults(data, doc.extend[i].keys);

		fn(err, data, doc.code);
	});
};

module.exports.listLang = function(fn) {
	model.find().select('-keys').exec(fn);
};


module.exports.opts = {
	lang : 'es'
};
