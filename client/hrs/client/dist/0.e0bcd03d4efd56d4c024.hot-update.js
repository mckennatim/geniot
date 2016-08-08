webpackHotUpdate(0,{

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(78), RootInstanceProvider = __webpack_require__(86), ReactMount = __webpack_require__(88), React = __webpack_require__(153); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	'use strict';
	
	var _reducers = __webpack_require__(169);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var _configureStore = __webpack_require__(190);
	
	var _configureStore2 = _interopRequireDefault(_configureStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var React = __webpack_require__(153);
	var ReactDOM = __webpack_require__(193);
	
	var _require = __webpack_require__(170);
	
	var compose = _require.compose;
	var createStore = _require.createStore;
	var combineReducers = _require.combineReducers;
	
	var _require2 = __webpack_require__(280);
	
	var Provider = _require2.Provider;
	
	var _require3 = __webpack_require__(289);
	
	var Router = _require3.Router;
	var Route = _require3.Route;
	var IndexRoute = _require3.IndexRoute;
	var browserHistory = _require3.browserHistory;
	
	var createHistory = __webpack_require__(298);
	
	var _require4 = __webpack_require__(697);
	
	var syncHistory = _require4.syncHistory;
	var syncHistoryWithStore = _require4.syncHistoryWithStore;
	
	var _require5 = __webpack_require__(349);
	
	var App = _require5.App;
	var Home = _require5.Home;
	var Verified = _require5.Verified;
	var Unverified = _require5.Unverified;
	var Wea = _require5.Wea;
	var Maps = _require5.Maps;
	var Register = _require5.Register;
	var DeviceInfo = _require5.DeviceInfo;
	
	
	var store = (0, _configureStore2.default)();
	
	var history = syncHistoryWithStore(browserHistory, store);
	
	ReactDOM.render(React.createElement(
	  Provider,
	  { store: store },
	  React.createElement(
	    'div',
	    null,
	    React.createElement(
	      Router,
	      { history: history },
	      React.createElement(
	        Route,
	        { path: '/', component: App },
	        React.createElement(IndexRoute, { component: Home }),
	        React.createElement(Route, { path: 'ver', component: Verified }),
	        React.createElement(Route, { path: 'ver/:id', component: DeviceInfo }),
	        React.createElement(Route, { path: 'reg', component: Register }),
	        React.createElement(Route, { path: 'unver', component: Unverified }),
	        React.createElement(Route, { path: 'maps', component: Maps }),
	        React.createElement(Route, { path: 'wea', component: Wea })
	      )
	    )
	  )
	), document.getElementById('app'));
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(185); if (makeExportsHot(module, __webpack_require__(153))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "app.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }

})
//# sourceMappingURL=0.e0bcd03d4efd56d4c024.hot-update.js.map