'use strict';

import axios from 'axios';
import { stringify } from 'querystring';

class Elitejax {
  // get config via object for elitejax constructor
  constructor(document) {
    this.config = {};
    this.document = document;
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
    let res = [];
    const elem = this.document.querySelectorAll('form');
    Array.from(elem).forEach((form) => {
      if (form.getAttribute('data-elitejax') === 'true') {
        const postTo = form.getAttribute('data-postTo');
        res.push({form, postTo});
      }
    });
    return res;
  }

  // gets value from form elements
  formData (inputs) {
    const res = {};
    const num = inputs.length;
    for (let i = 0; i < num; i++) {
      const valid = this.validInput(inputs[i]);
      if (valid[0]) {
        res[valid[1]] = valid[2];
      }
    }
    return res;
  }

  resolve (path, data) {
    return path.split(/[.\[]+/).reduce(function(prev, curr) {
        curr = curr.replace(/[\]]+/, '');
        return prev ? prev[curr] : undefined;
    }, data);
  }

  // validate user inputs according to input types
  validInput (inputEl) {
    const val = [true, '', ''];
    const name = inputEl.name.toLowerCase();
    const value = inputEl.value;
    const ex = inputEl.getAttribute('data-elitejax-x');
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
    str = (resType === 'jsonp') ? `?callback=${cbName}&` : str;
    str += `${stringify(obj)}`;
    return str;
  }

  ajaxForm (forms) {
    forms.forEach((form, index) => {
      form['form'].addEventListener('submit', (e) => {
        e.preventDefault();
        let name = e.target.getAttribute('name');
        let url = e.target.getAttribute('action');
        let method = e.target.getAttribute('method');
        let post = e.target.getAttribute('data-post');
        let data = this.formData(e.target.elements);
        // make ajax request
        this.ajaxIt(url, method, data, post, form['postTo'], name);
      });
    });
  }

  ajaxIt (url, method, data, post, postTo, name = null) {
    method = method.toUpperCase();
    if (this.config[name] === undefined || this.config[name] === null) {
      this.configure(name);
    }
    // destructure configuration for given form
    var { resType, callback } = this.config[name];
    if (resType === 'jsonp') {
      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      const cbName = `ej_${Date.now()}`;
      this.callback[cbName] = callback;
      script.src = url + this.params(data, resType, `elitejax.callback.${cbName}`);
      this.document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      let req;
      if (method === 'GET' || method === 'DELETE' || method === 'HEAD' && resType !== 'jsonp') {
        req = axios.get(url, {params: data});
      } else {
        req = axios.post(url, data);
      }
      req.then((response) => {
        if (postTo.length > 0) {
          Array.from(this.document.querySelectorAll(postTo)).forEach((output) => {
            output.innerHTML = this.resolve(post, response.data);
          });
        } else {
          callback();
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

}

let elitejax = () => {
  let ej = new Elitejax(document);
  ej.callback = {};
  return ej;
};

window['elitejax'] = elitejax();

export default elitejax;
