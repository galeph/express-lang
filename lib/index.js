'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.lang = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _format = require('format');

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Example:
 * 
 *  import {lang} form 'express-lang';
 *  let opts = { ...Options };
 *  let getL = (ListLangsForUser, callback) => {
 *    callback( error, jsonmsgid, codeLang )
 *  };
 *  let listL = (callback) => {
 *    callback( error, ArrayLangs );
 *  };
 *  let app = express();
 *  app.use(new lang(getL, listL, opts).local);
 * 
 */

var lang = function () {

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

	function lang(getLang, listLang, _ref) {
		var _ref$localte = _ref.localte;
		var localte = _ref$localte === undefined ? 't' : _ref$localte;
		var _ref$lang = _ref.lang;

		var // t('mystring %d', 1)
		_lang = _ref$lang === undefined ? 'en' : _ref$lang;

		var _ref$query = _ref.query;
		var query = _ref$query === undefined ? 'lang' : _ref$query;
		var _ref$session = _ref.session;
		var // ?lang=es_EN
		session = _ref$session === undefined ? 'lang' : _ref$session;
		var _ref$errorSelect = _ref.errorSelect;
		var // req.session.lang
		errorSelect = _ref$errorSelect === undefined ? 'No exist language' : _ref$errorSelect;
		var _ref$errorList = _ref.errorList;
		var errorList = _ref$errorList === undefined ? 'No have a list of language' : _ref$errorList;

		_classCallCheck(this, lang);

		this.error = {
			select: errorSelect,
			error: errorList
		};
		this.opts = {
			lang: _lang,
			query: query,
			session: session,
			localte: localte
		};

		if (!_.isFunction(getLang)) {
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


	_createClass(lang, [{
		key: '__setLang',
		value: function __setLang(req, fn) {
			var name = [];

			if (_.isString(req.query[this.opts.query])) {
				name.push(req.query[this.opts.query].toLowerCase().replace('_', '-'));
				name.push(req.query[this.opts.query].toLowerCase().substring(0, 2));
			}

			if (req.session[this.opts.session]) {
				name.push(req.session[this.opts.session]);
			}

			var header = req.acceptsLanguages().reverse();

			for (var i = header.length - 1; i >= 0; i--) {
				name.push(header[i].toLowerCase().replace('_', '-'));
				name.push(header[i].toLowerCase().substring(0, 2));
			}

			name.push(this.opts.lang);

			this.getLang(name, fn);
		}

		/**
   * translate System with translate
   * @param  {Object} lang Lang with translate
   * @return {Function}    Function with create the string
   */

	}, {
		key: '__translate',
		value: function __translate() {
			var lang = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			/**
    * Locatie or T
    * @param  {String}  arg[0] Tag or msgid
    * @param  {Any}    arg[..] Well the thing to add into the string
    * @return {String}         Translate
    */
			return function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				// tag, number || string, string, string, string
				var msgid = lang[args[0]] || args[0];
				delete args[0];
				args = _.compact(args);

				if (_.isArray(msgid)) {
					msgid = _.compact(msgid);
					var z = msgid[0];
					if (msgid.length > 1 && _.isNumber(args[0])) {
						for (var i = 0; i < msgid.length; i++) {
							if (i <= args[0]) z = msgid[i];
						}
					}
					msgid = z;
				}

				return (0, _format.vsprintf)(msgid, args);
			};
		}

		/**
   * local is the function connect with express/connect
   * @param  {object}   req  Request
   * @param  {object}   res  Responce
   * @param  {Function} next Next with next function in your app
   */

	}, {
		key: 'local',
		value: function local(req, res, next) {
			var _this = this;

			this.__setLang(req, function (err, lang, code) {
				if (err || !code) {
					return next(err || new Error(_this.error.select));
				}

				res[_this.opts.localte] = res.locals[_this.opts.localte] = _this.__translate(lang);

				if (req.session && code) {
					req.session[_this.opts.session] = code;
				}

				if (!_this.listLang) {
					return next();
				}

				_this.listLang(function (err, langs) {
					if (err || !langs) {
						return next(err || new Error(_this.error.list));
					}

					res[_this.opts.localte + 'List'] = res.locals[_this.opts.localte + 'List'] = langs;
					next();
				});
			});
		}
	}]);

	return lang;
}();

exports.lang = _lang;