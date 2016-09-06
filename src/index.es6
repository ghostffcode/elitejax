'use strict';

class Elitejax {
  // get config via object for elitejax constructor
  constructor () {
    this.config = {};
    window.callback = {}; // add callback object to window
    this.ajaxForm(this.getEl());
  }

  // function to add configurations to selected forms
  configure (name, config = {}) {
    // set default configuration
    const defaultConfig = {
      async: true,
      cType: 'application/json',
      resType: 'json',
      callback: function (data) {
        console.log(data);
      }
    };

    for (let prop in defaultConfig) {
      if (config[prop] === undefined) {
        config[prop] = defaultConfig[prop];
      }
    }

    this.config[name] = config;
    return this.config[name];
  }

  // gets elements that has been marked for elitejax
  getEl () {
    const res = [];
    const elem = document.querySelectorAll('form');
    Array.from(elem).forEach((val) => {
      if (val.getAttribute('data-elitejax')) {
        res.push(val);
      }
    });
    return res;
  }

  // gets value from form elements
  getElVal (formEl) {
    const res = {};
    const num = formEl.length;
    for (let i = 0; i < num; i++) {
      const valid = this.validInput(formEl[i]);
      if (valid[0]) {
        res[valid[1]] = valid[2];
      }
    }
    return res;
  }

  // validate user inputs according to input types
  validInput (inputEl) {
    const val = [true, '', ''];
    const name = inputEl.name.toLowerCase();
    const value = inputEl.value;
    const ex = inputEl.getAttribute('data-ej-x');
    if (name !== '' && value !== '' && name !== 'submit' && value !== 'submit' && ex === null) {
      val[1] = name;
      val[2] = value;
    } else {
      val[0] = false;
    }
    return val;
  }

  // convert object to url parameter
  params (obj = {}, resType = '', cbName = '') {
    var str = '';
    str = (resType === 'jsonp') ? `?${str}callback=${cbName}` : str;
    for (var key in obj) {
        if (str !== '') {
            str += '&';
        }
        str += `${key}=${obj[key]}`;
    }
    return str;
  }

  ajaxForm (el) {
    // Loop through all the elements
    el.forEach((v, i) => {
      // add on submit event listener to all of them
      v.addEventListener(v.getAttribute('data-listen'), (e) => {
        e.preventDefault(); // stop submission
        let name = e.target.getAttribute('name');
        let action = e.target.getAttribute('action');
        let method = e.target.getAttribute('method').toUpperCase();
        let data = this.getElVal(e.target.elements); // data for ajax
        if (this.config[name] === undefined) {
          this.configure(name);
        }
        // destructure configuration for given form
        var { async, cType, resType, callback } = this.config[name];
        // get AJAX ready
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            let response = this.responseText;
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
          var cbName = `ej_${Date.now()}`;
          // create add callback function to global callback object
          window.callback[cbName] = callback;
          // send data and callback function name to be added as parameters
          script.src = action + this.params(data, resType, `callback.${cbName}`);
          document.getElementsByTagName('head')[0].appendChild(script);
        } else {
          xhttp.open(method, action, async);
          xhttp.setRequestHeader('Content-type', cType);
          xhttp.send(this.params(data));
        }
      });
    });
  }
}

let ej = () => {
  return new Elitejax();
};

// make module available to browser
window.ej = window.elitejax = ej();

// call our class instanciator, whatever the name is
ej;
