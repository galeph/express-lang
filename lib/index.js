const _ = require('underscore');


module.exports = function (settings) {
	var settings = _.defaults( settings, {
		localte : 't',
		'default Lang' : 'en',
		query : 'lang'
	});
	if(!_.isFunction(settings.setLang))
		throw new Error('Need a Store!');

	settings.store.__set('default Lang', settings.langs);
	settings.store.__set('query', settings.query);

	return function local (res, req, next) {
		settings.store.setLang(req, function (err, lang){
			if(err || !lang)
				return next(err || new Error(settings.error || 'No exist language'));
			res[ settings.localte ] = res.locals[ settings.localte ] = settings.translate(lang);
			if( !settings.listLang )
				return next();
			settings.store.listLang(function(err, langs){
				if(err || !lang)
					return next(err || new Error(settings.error || 'No exist languages'));

				res[ settings.localte + 'List' ] = res.locals[ settings.localte + 'List' ] = langs;
				next();
			});
		});
	};
};

module.exports.Store = require('./store');