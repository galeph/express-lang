const express = require('express');
var store = require('./store');
var lang = require('../lib');
var app = express();

app.use(new lang(store.getLang, store.listLang, store.opts).local);
app.use(function(req, res){
	res.json({
		text : res.t(req.query.key),
		list : res.tList
	});
});