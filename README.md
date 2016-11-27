# elitejax

[![Build Status](https://travis-ci.org/ghostffcode/elitejax.svg?branch=master)](https://travis-ci.org/ghostffcode/elitejax) [![Bower version](https://badge.fury.io/bo/elitejax.svg)](https://badge.fury.io/bo/elitejax)

Simplifying Ajax Requests Using HTML attributes

### **Introduction**
---
Elitejax is a standalone javascript library that makes AJAX requests a lot more easier without you writing a single line of javascript.

All you have to do is add data-elitejax="true" attribute to your form tag and you are good to go

### **Installation**
---
You can install this library by cloning this git and reference the javascript files from the build directory, using npm:
```
npm install elitejax --save
```
or using bower:
```
bower install elitejax
```

### Usage Without javascript
If your request returns data as JSON, you can add to the DOM from that object without javascript using the `data-post` and `data-postTo` attributes in your form element.

The `data-post` attribute is used to specify what part of the data returned you want to use.
`data-postTo` is the DOM selector of where to post the resulting value.

```html
<!-- using the spotify API -->
<div class="result"></div>
<form name="spotify" data-elitejax="true" action="https://api.spotify.com/v1/search" data-post="artists.items[1].name" method="get" data-postTo=".result" >
  Enter name: <input type="text" name="q"><br />
  Category: <input type="text" name="type" value="artist"><br />
  <input type="submit" value="Submit">
</form>
<script src="path/to/javascript" charset="utf-8"></script>
```
The above will place the result in the div element with .result class.

### **Sample Usage Video**

[![elitejax](eliteJAX.png)](https://youtu.be/Hg9Xilkc5M0)

### Exclude form field
___
To exclude a form field in your form from your AJAX request, you can add data-ej-x attribute to that field, like:
```html
<!-- below form field will be ignored -->
<input type="input" data-elitejax-x />
```

### Adding custom configurations
---
Due to elitejax's flexibility, you can add custom configuration for each form in your webpage. First specify a name for your form and then use it with ej.configure, like so:

```html
<form data-elitejax="true" name="spotify" action="https://api.spotify.com/v1/search" method="get">
.....

</form>
<!-- include elitejax library from bower components directory -->
<script src="bower_components/elitejax/build/elitejax.min.js" charset="utf-8"></script>
<script type="text/javascript">
    elitejax.configure('spotify'[, {configuration}]);
</script>
```

The configuration object argument for the configure method takes 4 parameters:

* async **default: true** : You can set this to true or false

* cType **default: "application/json"** : This is the content type header.

* resType **default: "json"** : This is the response type of the AJAX query, you can use jsonp for cross domain requests.

* callback **default: function** : The default callback logs the data to the console. You can specify your callback function for when the request completes successfully

### Making Custom AJAX requests
---
You can use the elitejax ajaxIt method to send a custom AJAX request:
```javascript
elitejax.ajaxIt(url, method, data[, requestName]);
```
* url **(string)** : the API Endpoint or url the request is to be made to.
* method **(string)** : can be get/post/delete/put request type.
* data **(object)** : data you want to send to the url
* requestName - optional **(string)** : The name you want to give to your AJAX request. You need to set this if you want to use custom configuration (the elitejax configure method) with your AJAX request.

So, we can customize the spotify API call to run on page load instead of depending on user interaction like so:
```html
<script src="bower_components/elitejax/build/elitejax.min.js" charset="utf-8"></script>
<script type="text/javascript">
  window.onload = function () {
    var data = {
      q: 'Justin',
      type: 'artist'
    }
    elitejax.ajaxIt('https://api.spotify.com/v1/search', 'get', data, 'spotifyCustom');
  }
</script>
```

## **License**
Elitejax is Licensed under the [MIT License](../master/LICENSE)

## **Contributing**
Please do! Send a pull request after your modifications.

Sharing is caring.... make sure to let your peers know.
