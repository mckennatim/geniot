var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var cons = require('tracer').console();
var env = require('../../../env.json')

var cfg= env[process.env.NODE_ENV||'development']
var db = cfg.db
var secret = cfg.secret

var router = express.Router();

mongoose.connect(db.url);
var User = require('../../db/user');
var emailKey = require('./util').emmailKey
var createRandomWord = require('./util').createRandomWord
var blankUser= {name: '', email: '', lists:[], role:'', timestamp: 1, apikey: ''};

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.jsonp({message: "in root of registration module"})		
	});

	router.get('/isMatch/', function(req, res) {
		console.log('in isMatch');
		try{
			var name = req.query.name.toLowerCase();
			var email = req.query.email.toLowerCase();
			var apikey = "";
			cons.log(name + ' ' + email)
		}catch(err){
			cons.log(err)
			res.jsonp({message: 'bad query'});
			return;
		}
		var usr = {}
		var comboExists = 0;
		var eitherExists = 0;
		var message = '';
		User.find({name: name, email: email}, function(err, user) {
			if (user.length > 0) {
				usr = user[0];
			}
			cons.log(usr)
			cons.log(user.length)
			comboExists = user.length
			User.find({$or: [{name: name}, {email: email}]}, function(err, oitems) {
				cons.log(oitems)
				cons.log(oitems.length)
				eitherExists = oitems.length >0;
				if (eitherExists && !comboExists) {
					message = 'conflict'
					res.jsonp({message: message})
				} else {
					var upd ={}
					if (!comboExists && !eitherExists) {
						cons.log('neither combo or either exists so available, upserting new user')
						upd = blankUser;
						upd.name = name;
						upd.email = email;
						upd.timestamp = Date.now()
						message = 'available';
						upd.apikey = createRandomWord(24);
						apikey = upd.apikey;
					} else if (comboExists) {
						cons.log('matching combo exists, ')
						if (usr.apikey.length < 10) { //need a new apikey?
							upd.apikey = createRandomWord(24);
							apikey = upd.apikey
							upd.timestamp=Date.now()
						}else {
							apikey=usr.apikey
						}
						message = 'match';
					}
					cons.log(upd)
					cons.log(name)
					User.update({name: name}, upd, {upsert: true}, function(err, result){
						cons.log(result)
						cons.log(err)
						var emu = upd;
						emu.email = email;
						emu.apikey = apikey;
						emailKey(upd, function(ret){
							console.log(ret);
						});
						res.jsonp({message: message, result: result, err:err})
					})
				}
			});
		});
	})

	router.post('/authenticate/:name', 
	//passport.authenticate('localapikey', {session: false, failureRedirect: '/unauthorized'}),
		passport.authenticate('localapikey', {session: false}),
		function(req, res) {
			console.log(req.params)
			cons.log(req.user)
			console.log('just sent body in /authenticate')
			if (req.params.name==req.user.name){
				cons.log('names match')
				var payload = {name: req.user.name};
				var token = jwt.encode(payload, secret);
				var name =jwt.decode(token, secret);
				cons.log(name)
				res.jsonp({message: 'token here', token: token});
				cons.log(token);     
			}else {
				res.jsonp({message: 'apikey does not match user'});
			}
		}
	);
	router.get('/account', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res){ 
			console.log('in api/account ') 
			console.log(req.body)
			res.jsonp(req.user)
		}
	);
	router.get('/isUser/:name', function(req, res) {
		console.log('in isUser by name');
		var name = req.params.name.toLowerCase();
		console.log(name)
		User.findOne({name: name}, function(err, items) {
			console.log(items)
			if (items != null && items.name == name) {
				console.log('is registered')
				res.jsonp({
					message: ' already registered'
				})
			} else {
				res.jsonp({
					message: ' available'
				});
			}
		});
	});
	router.delete('/users/:name',
		passport.authenticate('bearer', { session: false }),  
		function(req, res) {
			console.log('in delete user by name');
			console.log(req.params);
			var name = req.params.name;
			User.remove({name: name}, function(err, resp) {
				//console.log(resp)
				res.jsonp({message: resp})
			});
		}
	);	

	return router;
}
