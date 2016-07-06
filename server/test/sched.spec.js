var expect = require('chai').expect
var schedut = require('../lib/modules/schedule/schedutil')
var prog = require('./prog2.json')


describe('datetime dtutils', function(){
	it('flattenProgObj', function(done){
		var ans = schedut.flattenProgObj(prog)
		console.log(ans[1])
		expect(typeof(ans[0])).to.equal("object");
		done()			
	})
})