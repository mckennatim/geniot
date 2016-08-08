import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';

describe("a spread operator can be used to",()=>{
	it('add an element to an array', ()=> {
		const listBefore = [0, 10, 20];
		const addEl = (list) => {
		  return [...list, 0];
		};
		const la = addEl(listBefore)
		console.log(listBefore)
		console.log(la)
		expect(la.length).to.equal(listBefore.length+1);
	})
	it('remove an element to an array', ()=> {
		const listBefore = [0, 10, 20, 12];
		const rmEl = (list, index) => {
		  return [...list.slice(0,index), ...list.slice(index+1)];
		};
		const la = rmEl(listBefore,2)
		console.log(listBefore)
		console.log(la)
		expect(la.length).to.equal(listBefore.length-1);
	})
	it('increment an element to an array', ()=> {
		const listBefore = [0, 10, 20, 12];
		const rmEl = (list, index) => {
		  return [...list.slice(0,index), list[index] +1, ...list.slice(index+1)];
		};
		const la = rmEl(listBefore,2)
		console.log(listBefore)
		console.log(la)
		expect(la[2]).to.equal(listBefore[2]+1);
	})
	it('change a property value of an object', ()=> {
		const listBefore = {    
			id: 0,
	    text: 'Learn Redux',
	    completed: false
	  };
		const rmEl = (lis) => {
		  return {
		  	...lis,
		  	completed: !lis.completed
		  }
		};
		const la = rmEl(listBefore)
		console.log(listBefore)
		console.log(la)
		expect(la.completed).to.equal(!listBefore.completed);
		console.log('needs babel-preset-stage-2')
	})
})