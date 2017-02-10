'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getv = getv;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getv() {
	console.log('dogfood from db.js');
}
var fetv = exports.fetv = function fetv() {
	console.log('from a es6 function');
};

function agetv() {
	console.log('dogfood from agetv');
}
var afetv = function afetv() {
	console.log('from a es6 function afgetv');
};

var aa = exports.aa = {
	agetv: agetv,
	afetv: afetv
};

var Aa = exports.Aa = function () {
	function Aa() {
		_classCallCheck(this, Aa);

		this.dog = 'uli';
		this.cat = 'mabibi';
	}

	_createClass(Aa, [{
		key: 'animals',
		value: function animals() {
			return 'my animals are ' + this.dog + ' and ' + this.cat; //requires `` not ''
		}
	}]);

	return Aa;
}();