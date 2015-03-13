const _ = require('underscore');

module.exports = function (settings) {
	var settings = _.defaults( settings, {
		localte : 't',
		lang : 'en',
		query : 'lang', // ?lang=es_EN
		error : {
			select : 'No exist language',
			list : 'No habe a list of language '
		}

		
	});
	if(!_.isFunction(settings.store.setLang))
		throw new Error('Need a Store!');

	settings.store.__set('default Lang', settings.lang);
	settings.store.__set('query', settings.query);

	return function local (res, req, next) {
		settings.store.setLang(req, function (err, lang, code){
			if(err || !lang || !_.isObject(lang))
				return next(err || new Error(settings.error.select));

			res[ settings.localte ] = res.locals[ settings.localte ] = settings.translate(lang);

			if(req.session && code )
				req.session.lang = code;
			
			if( !settings.listLang )
				return next();

			settings.store.listLang(function(err, langs){
				if(err || !lang)
					return next(err || new Error(settings.error.list));

				res[ settings.localte + 'List' ] = res.locals[ settings.localte + 'List' ] = langs;
				next();
			});
		});
	};
};

module.exports.Store = require('./store');