import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';


describe("an immutable map",()=>{
	describe("a map",()=>{
		it("modifies a map", ()=>{
			let state = new Map({panel: "auto", relay: "on", by: 'forecast'})
			let nextState = state.update("by", b=>'user')
			expect(state.get('by')).to.equal("forecast")
			expect(nextState.get('by')).to.equal("user")
			//console.log(nextState)
		});
		it("modifies a bigger map", ()=>{
			let state = fromJS({ctrl: {panel: "auto", relay: "on", by: 'forecast'},
				cond: {temp: 67, sky: "cloudy"},
				forecast: {isSnow: true, when: "now", accum: 10}});
			let nextState = state.setIn(['ctrl', 'by'], 'user')
			//console.log(state)
			expect(state.getIn(['ctrl', 'by'])).to.equal("forecast")
			expect(nextState.getIn(['ctrl', 'by'])).to.equal("user")
			//console.log(nextState)
		})
	})
})