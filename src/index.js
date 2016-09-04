import $ from "jquery";

class elitejax {
  // get config via object for elitejax constructor
  constructor (config = {}) {
    this.config = config;
    this.ajaxForm(this.getEl());
  };

  // gets elements that has been marked for elitejax
  getEl () {
    let res = [];
    let elem = document.querySelectorAll('form');
    Array.from(elem).forEach((v, i)=> {
      if (v.getAttribute('data-elitejax')) {
        res.push(v);
      }
    });
    return res;
  }

  // gets value from form elements
  getElVal(formEl) {
    let res = {};
    let num = formEl.length;
    for (let i = 0; i < num; i++) {
      let valid = this.validInput(formEl[i]);
      if(valid[0]) {
        res[valid[1]] = valid[2];
      }
    }
    return res;
  }

  // validate user inputs according to input types
  validInput (inputEl) {
    let val = [true, '', ''];
    let name = inputEl.name.toLowerCase();
    let value = inputEl.value;
    if (name !== '' && value !== '' && name !== 'submit' && value !== 'submit') {
      val[1] = name;
      val[2] = value;
    } else {
      val[0] = false;
    }
    return val;
  }


  ajaxForm (el) {
    // Loop through all the elements
    el.forEach((v, i) => {
      // add on submit event listener to all of them
      v.addEventListener(v.getAttribute('data-listen'), (e) => {
        e.preventDefault(); // stop submission
        let action = e.target.getAttribute('action');
        let method = e.target.getAttribute('method').toUpperCase();
        let data = this.getElVal(e.target.elements); // data for ajax
        let callback = this.config.cb;
        // get AJAX ready
        $.ajax({
          method: method,
          contentType: this.config.cType,
          url: action,
          data: data,
          dataType: this.config.resType
        })
        .done(function (x) {
          callback(x);
        });

      });
    });
  }

}

let ej = (config = {
  async: true,
  cType: "application/json",
  resType: 'json',
  cb: function (data) {
    console.log(data);
  }
}) => {
  return new elitejax(config);
}

window.ej = window.elitejax = ej;
