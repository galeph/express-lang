# express-lang

System for lang

## Install

	$ npm install express-lang


## Use


Config

	var lang = require('express-lang');
	app.use( new Lang( getLang, listLang, options));


Store

	let getLang = (ListLangsForUser, callback) => {
		let codeLang = 'es';
		let jsonmsgid = {
			'translate' : [ 'tradicir', 'traducion', ... ],
			'number is %d' : [ 'El numero es %d' ]
		};

		callback( error, jsonmsgid, codeLang )
	};
	let listLang = (callback) => {
		let ArrayLangs = [ 'es', 'en' ];
	 	callback( error, ArrayLangs );
	};

Templates

	p= t('translate')
	p= t('number is %d', 10)

Render

	<p>tradicir</p>
	<p>El numero es 10</p>

### Options

* `localte`: The name of the function to translate
* `lang` : The decfult languge
* `query` : The query to change the language
* `errorSelect` : The error when no have thats language
* `errorList` : The error when no have the list
