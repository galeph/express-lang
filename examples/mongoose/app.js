const express = require('express');
var store = require('./store');

var lang =require('../lib');
var app = express();


app.use(lang({
	langs : 'en',
	localte : 't',
	store : new store('mongo://localhost:2017/myDB')
}));

app.use(function(req, res){
	res.json({
		text : res.t(req.query.key),
		list : res.tList
	});
});