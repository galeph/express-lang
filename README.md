# express-lang

System for lang

## Install

	$ npm install express-lang


## Use


Config

	var expressLang = require('express-lang');
	app.use(expressLang(options));


Store


	var expressLang = require('express-lang');
	var translate = function(options) {
		expressLang.Store.call(this, options);
	};

	util.inherits(translate,  expressLang.Store);

	translate.prototype.getLang = function (langs, fn) {
		// langs => [ 'es_es', 'es', 'en_us', 'en' ]
		var keys = {
			// Your translate
			'my Key' : 'This is the translate',
			'and other' :'This is other %s'
		};

		fn(err, keys, code);
	};

	translate.prototype.listLang = function(fn) {
		fn(err, [
			// List the language
		])
	};

Templates

	p= t('my Key')
	p= t('and other', 'key')

Render

	<p>This is the translate</p>
	<p>This is other key</p>

### options

* `localte`: The name of the function to translate
* `lang` : The decfult languge
* `query` : The query to change the language
* `error`.`select` : The error when no have thats language
* `error`.`list` : The error when no have the list
* `store` : Your store