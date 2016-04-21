import {vsprintf} from 'format';
import * as _ from 'underscore';

/**
 *  opts = {};
 *  getL = (ListLangsForUser, callback) => {
 *    callback( error, jsonmsgid, codeLang )
 *  };
 *  listL = (callback) => {
 *    callback( error, ArrayLangs );
 *  };
 *  let app = express();
 *  app.use(new lang(getL, listL, opts).local);
 * 
 */

export class lang {

	/**
	 * Lang constructor
	 * @param  {Function} getLang           Get words the trasnlate 
	 * @param  {Function} listLang          Get all the list langs
	 * @param  {String} options.localte     Name function, for translate
	 * @param  {String} options.lang        Lang default
	 * @param  {String} options.query       Query in the URL
	 * @param  {String} options.session     In the session the lang
	 * @param  {String} options.errorSelect Error when select and dont have eny
	 * @param  {String} options.errorList   Error when select and dont have eny
	 */
	constructor (getLang, listLang,{
		localte = 't', // t('mystring %d', 1)
		lang = 'en', 
		query = 'lang', // ?lang=es_EN
		session ='lang', // req.session.lang
		errorSelect = 'No exist language',
		errorList = 'No have a list of language'
	}) {
		this.error = {
			select : errorSelect,
			error : errorList,
		};
		this.opts = {
			lang,
			query,
			session,
			localte
		};

		if(!_.isFunction(getLang)){
			throw new Error('Need a Store! in GetLang');
		}

		this.getLang = getLang;
		this.listLang = listLang;

	}

	/**
	 * setLang Gate all the langs with send
	 * @param {object}   req Request
	 * @param {Function} fn  Callback function
	 */
	__setLang (req, fn) {
		var name = [];

		if( _.isString(req.query[this.opts.query]) ){
			name.push(req.query[this.opts.query].toLowerCase().replace('_', '-') );
			name.push(req.query[this.opts.query].toLowerCase().substring(0,2) );
		}
		
		if(req.session[this.opts.session]){
			name.push(req.session[ this.opts.session ]);
		}

		let header = req.acceptsLanguages().reverse();
		
		for (let i = header.length - 1; i >= 0; i--){
			name.push( header[i].toLowerCase().replace('_', '-') );
			name.push( header[i].toLowerCase().substring(0,2) );
		}
		
		name.push( this.opts.lang );

		this.getLang(name, fn);
	}

	/**
	 * translate System with translate
	 * @param  {Object} lang Lang with translate
	 * @return {Function}    Function with create the string
	 */
	__translate (lang={}) {
		/**
		 * Locatie or T
		 * @param  {String}  arg[0] Tag or msgid
		 * @param  {Any}    arg[..] Well the thing to add into the string
		 * @return {String}         Translate
		 */
		return (...args) => { // tag, number || string, string, string, string
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
			
			return vsprintf(msgid, args );
		};
	}

	/**
	 * local is the function connect with express/connect
	 * @param  {object}   req  Request
	 * @param  {object}   res  Responce
	 * @param  {Function} next Next with next function in your app
	 */
	local (req, res, next) {
		this.__setLang(req, (err, lang, code) => {
			if(err || !code){
				return next(err || new Error(this.error.select));
			}

			res[ this.opts.localte ] = res.locals[ this.opts.localte ] = this.__translate(lang);

			if(req.session && code ){
				req.session[ this.opts.session ] = code;
			}
			
			if( !this.listLang ){
				return next();
			}

			this.listLang((err, langs) => {
				if(err || !langs){
					return next(err || new Error(this.error.list));
				}

				res[ `${this.opts.localte}List` ] = res.locals[ `${this.opts.localte}List` ] = langs;
				next();
			});
		});
	}
}
