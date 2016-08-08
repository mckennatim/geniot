webpackHotUpdate(0,{

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(77), RootInstanceProvider = __webpack_require__(85), ReactMount = __webpack_require__(87), React = __webpack_require__(139); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	"use strict";

	var _react = __webpack_require__(139);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// class Ver extends React.component{
	// 	constructor() {
	//     super()
	//   }
	// 	render () {
	// 		return <div>
	// 			<h4>Verify an address</h4>
	// 			<input type="text" size="60"/><br/>
	// 			<button >Find in google</button>
	// 	  </div>;
	// 	}
	// }

	// module.exports = Ver;

	module.exports = function Ver() {
			return _react2.default.createElement(
					"div",
					null,
					_react2.default.createElement(
							"h4",
							null,
							"Verify an bad address"
					),
					_react2.default.createElement("input", { type: "text", size: "60" }),
					_react2.default.createElement("br", null),
					_react2.default.createElement(
							"button",
							null,
							"Find in google"
					)
			);
	};

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(317); if (makeExportsHot(module, __webpack_require__(139))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Ver.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }

})