var superagent = require('superagent')
import {expect} from 'chai';
var ht = require('../lib/cfg').cfg();
import fetch from 'isomorphic-fetch'


var httpLoc = `${ht.url}:${ht.port}/api/hrs/verify-addr/`
var agent = superagent.agent();
var homeId;
var raw;

describe('verify-addr:api', function(){
	it('gets verified records and lists [2].raw', function(done){
		agent
		.get(httpLoc)
		.end(function(e,res){
			//console.log(e)
			var res = res.body;
			console.log(res[2].raw);
			expect(res[2].raw).to.equal('Climax Mine, Colorado, CO')
			done();
		})
	});
	it('encodes then decodes sample uri', function(done){
		var str = "%Parley Vale%";
		var enc = encodeURI(str);
		var unc = decodeURI(enc)
		expect(unc).to.equal(str);
		done();
	});
	it('retrieves records like raw %Parley Vale%', function(done){
		var str = "Parley Vale";
		var enc = encodeURI(str);
		var unc = decodeURI(enc)
		var ur = `${httpLoc}like/${enc}`
		agent
			.get(ur)
			.end(function(e,res){
				if (res.body.length>0){
					var res = res.body
					homeId=res[0].id
					raw=res[0].raw
					expect(raw.indexOf(str)).is.above(-1)
				}
				done();
			})
	});
	it('puts an update for home', function(done){
		var body = {address: raw, devid: 'XXAMSJDRF1', veri:1}
		superagent
			.put(`${httpLoc}${homeId}`)
			.set('origin', ht.url)
			.send(body)
			.end(function(e,res){
				//console.log(e)
				console.log(res.body)
				expect(res.body.affectedRows).to.equal(1)
				done();
			})
	})
	it('puts a fetch update for home', function(done){
		var body = {address: raw, devid: 'IAMSJDRF1', veri:1}
		//var formd = new FormData()

		body = JSON.stringify(body)
		fetch(`${httpLoc}${homeId}`, {
			method: 'put', 
			headers: {
				'origin': ht.url
			},
			body: body})
			.then(function(res){
				//console.log(e)
				console.log(res.body)
				expect(res.body.affectedRows).to.equal(1)
				done();
			})
	})
})
