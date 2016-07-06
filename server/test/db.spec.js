var Device = require('../lib/db/devices.js')
var User = require('../lib/db/user.js')
var expect = require('chai').expect
var mongoose = require('mongoose');
var env = require('../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var db = cfg.db

mongoose.connect(db.url);
var dev = "LMNOP2D001"
// var dev = "CYURD001"

describe('device db:', function() {
	it('finds this file', function(done){
		expect(1).to.equal(1);
		done()
	})
	it('finds a user record', function(done){
		User.findOne({name: 'tim'}, function(err, items) {
			console.log(items)
			tim = items
			expect(items.name).to.equal('tim');
			done()
		})
	})
	it('writes a device record', function(done){
		var inn = {
			devid: dev,
			domain: "parley",
			usersarr: [],
			users: [],
			loc: {
				lat: 2334555.3344,
				lng: 12345.2344,
				timezone: "America/New_York",
				address: "12 Parley Vale, Jamaica Plain, MA 02130"
			}
		}
		var newdev = new Device(inn)
		newdev.save(function(err, items){
			if (err){
				console.log(err.toJSON())
				expect(err.toJSON().code).to.equal(11000);				
			}else{
				console.log(items)
				expect(items.domain).to.equal("parley");				
			}
			done()
		})	
	})
	it('add tim to the CYURD001 device', function(done){
		//Device.remove({devid: dev} )
		Device.update({devid: dev}, {$push: {usersarr: tim.name}}, function(err, items){
			console.log(items)
			console.log(err)
			expect(items.ok).to.equal(1);
			done()		
		})
	})
	// it('pull tim from the CYURD001 device', function(done){
	// 	//Device.remove({devid: dev} )
	// 	Device.update({devid: dev}, {$pull: {usersarr: tim.name}}, function(err, items){
	// 		console.log(items)
	// 		console.log(err)
	// 		expect(items.ok).to.equal(1);
	// 		done()		
	// 	})
	// })
	it('add tim and tim emailto the CYURD001 device', function(done){
		//Device.remove({devid: dev} )
		Device.update({devid: dev}, {$push: {usersarr: tim.name}, $push: {users: {name: tim.name, email: tim.email}}}, function(err, items){
			console.log(items)
			console.log(err)
			expect(items.ok).to.equal(1);
			done()		
		})
	})
	it('show all devices', function(done){
		Device.find({}, function(err, items){
			console.log(items)
			console.log(err)
			expect(1).to.equal(1);
			done()		
		})
	})
	it('deletes test device', function(done){
		Device.remove({devid: dev}, function(err,items){
			console.log(items.result)
			expect(1).to.equal(1);
			done()		
		})
	})
	it('changes timezone to string', function(done){
		var nt = {
			lat: 14.34500000,
			lng: -72.44400000,
			timezone: "America/New_York",
			address: "12 Parley Vale, Jamaica Plain, MA 02130"
		}
		Device.update({devid:"CYURD001"}, {$set:{loc:nt}}, function(err, items){
			console.log(items)
			console.log(err)
			expect(1).to.equal(1);
			done()				
		})
	})
})