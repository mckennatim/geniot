export function getv(){
	console.log('dogfood from db.js')
}
export var fetv = ()=> {
	console.log('from a es6 function')
}


function agetv(){
	console.log('dogfood from agetv')
}
var afetv = ()=> {
	console.log('from a es6 function afgetv')
}

export var aa = {
	agetv:agetv,
	afetv:afetv
}

export class Aa {
	constructor(){
		this.dog ='uli';
		this.cat ='mabibi';
	}
	animals(){
		return `my animals are ${this.dog} and `+this.cat;//requires `` not ''
	}
}
