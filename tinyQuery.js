// TinyQueryString - A really tiny URL query string utility
// author : Richard Westenra
// license : MIT
// richardwestenra.com/tiny-query-string

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['tinyQuery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tinyQuery = factory();
  }
}(this, function (undefined) {
  'use strict';

  var getRegex = function(name) {
    return new RegExp('[\\?&](' + name + ')=?([^&#]*)', 'i');
  };

  var setDefault = function(text) {
    return typeof text === 'undefined' ? (
      window ? window.location.search : ''
    ) : text;
  };

  return {
    get: function(name, text) {
      var match = setDefault(text).match( getRegex(name) );
      if (!match) {
        return false;
      } else if (match[2]) {
        return decodeURIComponent(match[2]);
      } else {
        return true;
      }
    },

    getMany: function(arr, text) {
      return arr.map(function(d) {
        return this.get(d, setDefault(text));
      }.bind(this));
    },

    set: function(name, value, text) {
      text = setDefault(text);
      var regex = getRegex(name),
      match = regex.exec(text),
      pair = value ? name + '=' + encodeURIComponent(value) : name;

      if (!text.length || text.indexOf('?') < 0) {
        // If there are no existing queries then create new one:
        return (text || '') + '?' + pair;
      } else if (match) {
        // If there is an existing query for this name then update the value:
        return text.replace(regex, match[0].charAt(0) + pair);
      } else {
        // If there are existing queries but not for this name then add it to the end:
        return text + '&' + pair;
      }
    },

    setMany: function(arr, text) {
      return arr.reduce(function(txt, d) {
        return this.set(d.name, d.value, txt);
      }.bind(this), setDefault(text));
    },

    remove: function(name, text) {
      return setDefault(text).replace(getRegex(name), '');
    }
  };
}));