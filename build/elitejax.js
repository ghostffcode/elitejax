/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Elitejax = function () {
	  // get config via object for elitejax constructor
	  function Elitejax() {
	    _classCallCheck(this, Elitejax);
	
	    this.config = {};
	    window.callback = {}; // add callback object to window
	    this.ajaxForm(this.getEl());
	  }
	
	  // function to add configurations to selected forms
	
	
	  _createClass(Elitejax, [{
	    key: 'configure',
	    value: function configure(name) {
	      var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      // set default configuration
	      var defaultConfig = {
	        async: true,
	        cType: 'application/json',
	        resType: 'json',
	        callback: function callback(data) {
	          console.log(data);
	        }
	      };
	
	      for (var prop in defaultConfig) {
	        if (config[prop] === undefined) {
	          config[prop] = defaultConfig[prop];
	        }
	      }
	
	      this.config[name] = config;
	      return this.config[name];
	    }
	
	    // gets elements that has been marked for elitejax
	
	  }, {
	    key: 'getEl',
	    value: function getEl() {
	      var res = [];
	      var elem = document.querySelectorAll('form');
	      Array.from(elem).forEach(function (val) {
	        if (val.getAttribute('data-elitejax') !== null) {
	          res.push(val);
	        }
	      });
	      return res;
	    }
	
	    // gets value from form elements
	
	  }, {
	    key: 'getElVal',
	    value: function getElVal(formEl) {
	      var res = {};
	      var num = formEl.length;
	      for (var i = 0; i < num; i++) {
	        var valid = this.validInput(formEl[i]);
	        if (valid[0]) {
	          res[valid[1]] = valid[2];
	        }
	      }
	      return res;
	    }
	
	    // validate user inputs according to input types
	
	  }, {
	    key: 'validInput',
	    value: function validInput(inputEl) {
	      var val = [true, '', ''];
	      var name = inputEl.name.toLowerCase();
	      var value = inputEl.value;
	      var ex = inputEl.getAttribute('data-ej-x');
	      if (name !== '' && value !== '' && name !== 'submit' && value !== 'submit' && ex === null) {
	        val[1] = name;
	        val[2] = value;
	      } else {
	        val[0] = false;
	      }
	      return val;
	    }
	
	    // convert object to url parameter
	
	  }, {
	    key: 'params',
	    value: function params() {
	      var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var resType = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var cbName = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
	
	      var str = '';
	      str = resType === 'jsonp' ? '?' + str + 'callback=' + cbName : str;
	      for (var key in obj) {
	        if (str !== '') {
	          str += '&';
	        }
	        str += key + '=' + obj[key];
	      }
	      return str;
	    }
	  }, {
	    key: 'ajaxForm',
	    value: function ajaxForm(el) {
	      var _this = this;
	
	      // Loop through all the elements
	      el.forEach(function (v, i) {
	        // add on {listen} event listener to all of them
	        v.addEventListener('submit', function (e) {
	          e.preventDefault(); // stop submission
	          var name = e.target.getAttribute('name');
	          var action = e.target.getAttribute('action');
	          var method = e.target.getAttribute('method').toUpperCase();
	          var data = _this.getElVal(e.target.elements); // data for ajax
	          // build complete configuration
	          if (_this.config[name] === undefined) {
	            _this.configure(name);
	          }
	          _this.ajaxIt(action, method, data, _this.config[name]);
	        });
	      });
	    }
	  }, {
	    key: 'ajaxIt',
	    value: function ajaxIt(action, method, data, config) {
	      // destructure configuration for given form
	      var async = config.async;
	      var cType = config.cType;
	      var resType = config.resType;
	      var callback = config.callback;
	      // get AJAX ready
	
	      var xhttp = new XMLHttpRequest();
	      xhttp.onreadystatechange = function () {
	        if (this.readyState === 4 && this.status === 200) {
	          var response = this.responseText;
	          if (resType === 'json') {
	            response = JSON.parse(response);
	            callback(response);
	          }
	        }
	      };
	      // make request
	      if (method === 'GET' && resType !== 'jsonp') {
	        xhttp.open(method, action + '?' + this.params(data), async);
	        xhttp.setRequestHeader('Content-type', cType);
	        xhttp.send();
	      } else if (method === 'GET' && resType === 'jsonp') {
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        // create random callback name
	        var cbName = 'ej_' + Date.now();
	        // create add callback function to global callback object
	        window.callback[cbName] = callback;
	        // send data and callback function name to be added as parameters
	        script.src = action + this.params(data, resType, 'callback.' + cbName);
	        document.getElementsByTagName('head')[0].appendChild(script);
	      } else {
	        xhttp.open(method, action, async);
	        xhttp.setRequestHeader('Content-type', cType);
	        xhttp.send(this.params(data));
	      }
	    }
	  }]);
	
	  return Elitejax;
	}();
	
	var ej = function ej() {
	  return new Elitejax();
	};
	
	// make module available to browser
	window.ej = window.elitejax = ej();
	
	// call our class instanciator, whatever the name is
	ej;

/***/ }
/******/ ]);
//# sourceMappingURL=elitejax.js.map