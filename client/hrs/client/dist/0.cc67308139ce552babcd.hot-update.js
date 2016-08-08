webpackHotUpdate(0,{

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(78), RootInstanceProvider = __webpack_require__(86), ReactMount = __webpack_require__(88), React = __webpack_require__(153); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.App = undefined;
	
	__webpack_require__(351);
	
	var _actions = __webpack_require__(648);
	
	var React = __webpack_require__(153);
	
	var _require = __webpack_require__(289);
	
	var Link = _require.Link;
	
	var _require2 = __webpack_require__(280);
	
	var connect = _require2.connect;
	
	var _require3 = __webpack_require__(697);
	
	var _pushPath = _require3.pushPath;
	
	
	function App(_ref) {
	  var pushPath = _ref.pushPath;
	  var children = _ref.children;
	  var deviceTypeChanged = _ref.deviceTypeChanged;
	  var deviceTypes = _ref.deviceTypes;
	  var deviceSizes = _ref.deviceSizes;
	
	  var rtime;
	  var timeout = false;
	  var delta = 200;
	  var doneResizing = function doneResizing() {
	    var ws = window.innerWidth;
	    var devs = deviceTypes;
	    var wsizes = deviceSizes;
	    var thei;
	    var sum = wsizes.reduce(function (t, n, i) {
	      if (t < ws && ws <= n) {
	        thei = i;
	      }
	      return n;
	    }, 0);
	    var brow = { browser: devs[thei], size: ws };
	    console.log(brow);
	    deviceTypeChanged(brow);
	  };
	  var resizeEnd = function resizeEnd() {
	    if (new Date() - rtime < delta) {
	      setTimeout(resizeEnd, delta);
	    } else {
	      timeout = false;
	      doneResizing();
	    }
	  };
	  var handleResize = function handleResize() {
	    rtime = new Date();
	    if (timeout === false) {
	      timeout = true;
	      setTimeout(resizeEnd, delta);
	    }
	  };
	
	  window.addEventListener('resize', handleResize);
	
	  return React.createElement(
	    'div',
	    null,
	    React.createElement(
	      'header',
	      null,
	      'Links:',
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/' },
	        'Home'
	      ),
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/ver' },
	        'Verified'
	      ),
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/reg' },
	        'Register'
	      ),
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/wea' },
	        'Wea'
	      ),
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/maps' },
	        'Maps'
	      ),
	      ' ',
	      React.createElement(
	        Link,
	        { to: '/unver' },
	        'Unverified'
	      )
	    ),
	    React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'button',
	        { onClick: function onClick() {
	            return pushPath('/ver');
	          } },
	        'Go to /ver'
	      )
	    ),
	    React.createElement(
	      'div',
	      { style: { marginTop: '1.5em' } },
	      children
	    )
	  );
	};
	
	var mapStateToProps = function mapStateToProps(state) {
	  return {
	    deviceTypes: state.device.types,
	    deviceSizes: state.device.sizes
	  };
	};
	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return {
	    deviceTypeChanged: function deviceTypeChanged(typeInfo) {
	      dispatch((0, _actions.setDeviceType)(typeInfo));
	    },
	    pushPath: function pushPath(path) {
	      dispatch(_pushPath(path));
	    }
	  };
	};
	
	//App = connect(null, { pushPath })(App);
	exports.App = App = connect(mapStateToProps, mapDispatchToProps)(App);
	
	exports.App = App;
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(185); if (makeExportsHot(module, __webpack_require__(153))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "App.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }

})
//# sourceMappingURL=0.cc67308139ce552babcd.hot-update.js.map