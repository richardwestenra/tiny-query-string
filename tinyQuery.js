// TinyQueryString - A really tiny URL query string utility
// author : Richard Westenra
// license : MIT
// github.com/richardwestenra/tiny-query-string

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
    get: function(arg1, arg2) {
      if (typeof arg1 === 'object') {
        return this.getMany.apply(this, arguments);
      } else if (!arg1 || arg2 === false) {
        return this.getAll.apply(this, arguments);
      } else {
        return this.getOne.apply(this, arguments);
      }
    },

    getOne: function(name, text) {
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
      return arr.reduce(function(obj, key) {
        obj[key] = this.getOne(key, setDefault(text));
        return obj;
      }.bind(this), {});
    },

    getAll: function(text) {
      text = setDefault(text).match(/\?(.+)/);
      if (!text) {
        return {};
      } else {
        var keys = text[1].split('&').map(function(pair) {
          return pair.split('=')[0].toLowerCase();
        });
        return this.getMany.call(this, keys, text[0]);
      }
    },

    set: function(arg) {
      return  (typeof arg === 'object') ?
        this.setMany.apply(this, arguments) :
        this.setOne.apply(this, arguments);
    },

    setOne: function(name, value, text) {
      text = setDefault(text);
      var regex = getRegex(name),
        match = regex.exec(text);
      if (value && (typeof value === 'string' || typeof value === 'number')) {
        name = name + '=' + encodeURIComponent(value);
      }

      if (!text.length || text.indexOf('?') < 0) {
        return (text || '') + '?' + name;
      } else if (match) {
        return text.replace(regex, match[0].charAt(0) + name);
      } else {
        return text + '&' + name;
      }
    },

    setMany: function(values, text) {
      if (Array.isArray(values)) {
        return values.reduce(function(txt, d) {
          return this.setOne(d, false, txt);
        }.bind(this), setDefault(text));
      }
      return Object.keys(values).reduce(function(txt, key) {
        return this.setOne(key, values[key], txt);
      }.bind(this), setDefault(text));
    },

    remove: function(arg1, arg2) {
      if (typeof arg1 === 'object') {
        return this.removeMany.apply(this, arguments);
      } else if (!arg1 || arg2 === false) {
        return this.removeAll.apply(this, arguments);
      } else {
        return this.removeOne.apply(this, arguments);
      }
    },

    removeOne: function(name, text) {
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

    removeMany: function(arr, text) {
      return arr.reduce(function(txt, d) {
        return this.removeOne(d, txt);
      }.bind(this), setDefault(text));
    },

    removeAll: function(text) {
      return setDefault(text).split('?')[0];
    }
  };
}));