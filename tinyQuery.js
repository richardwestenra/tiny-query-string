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
}(this, function () {
  'use strict';

  var getRegex = function(name) {
    return new RegExp('[\?&](' + name + ')=?([^&#]*)', 'i');
  };

  var setDefault = function(text) {
    return typeof text !== 'string' ? (
      typeof window !== 'undefined' ? window.location.search : ''
    ) : text;
  };

  return {
    get: function(name, text) {
      if (typeof name === 'object') {
        return name.reduce(function(obj, key) {
          obj[key] = this.getOne(key, setDefault(text));
          return obj;
        }.bind(this), {});
      }
      var match = setDefault(text).match( getRegex(name) );
      if (!match) {
        return false;
      } else if (match[2]) {
        return decodeURIComponent(match[2]);
      } else {
        return true;
      }
    },

    getAll: function(text) {
      text = setDefault(text).match(/\?(.+)/);
      if (!text) {
        return {};
      } else {
        var keys = text[1].split('&').map(function(pair) {
          return pair.split('=')[0];
        });
        return this.getMany.call(this, keys, text[0]);
      }
    },

    set: function(name, value, text) {
      text = setDefault(text);

      if (Array.isArray(name)) {
        return name.reduce(function(txt, d) {
          return this.set(d, false, txt);
        }.bind(this), text);

      } else if (typeof name === 'object') {
        return Object.keys(name).reduce(function(txt, key) {
          return this.set(key, name[key], txt);
        }.bind(this), text);
      }

      var regex = getRegex(name),
        match = regex.exec(text),
        pair = value ? name + '=' + encodeURIComponent(value) : name;

      if (!text.length || text.indexOf('?') < 0) {
        return (text || '') + '?' + pair;
      } else if (match) {
        return text.replace(regex, match[0].charAt(0) + pair);
      } else {
        return text + '&' + pair;
      }
    },

    remove: function(name, text) {
      if (typeof name === 'object') {
        return name.reduce(function(txt, d) {
          return this.removeOne(d, txt);
        }.bind(this), setDefault(text));
      }
      
      text = setDefault(text).match(/([^\?]*)(\?*.*)/);
      if (!text) {
        return false;
      } else if (!text[2].length) {
        return text[1];
      } else {
        var remainingKeys = Object.keys(this.getAll(text[2]))
          .filter(function(key){
            return key !== name;
          });
        return this.setMany(remainingKeys, text[1]);
      }
    },

    removeAll: function(text) {
      return setDefault(text).split('?')[0];
    }
  };
}));