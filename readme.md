# Tiny Query String

A tiny (2kb minified) JS library for reading & writing URL query strings.

[![Build Status](https://travis-ci.org/richardwestenra/tiny-query-string.svg?branch=master)](https://travis-ci.org/richardwestenra/tiny-query-string)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Installation

#### NPM:
```
npm install tiny-query-string --save
```

#### Bower:
```
bower install tiny-query-string --save
```

## Usage examples
```
const tinyQuery = require('tinyQuery');

tinyQuery.get('foo', 'example.com?foo=bar&baz'); // 'bar'
tinyQuery.get(['foo', 'baz'], 'example.com?foo=bar&baz'); // {'foo':'bar', 'baz':true}
tinyQuery.get('example.com?foo=bar&baz', false); // {'foo':'bar', 'baz':true}

tinyQuery.set('foo', 'bar', 'example.com?baz'); // 'example.com?baz&foo=bar'
tinyQuery.set(['foo', 'bar'], 'example.com?baz'); // 'example.com?baz&foo&bar'
tinyQuery.set({'foo':123, 'bar':'qux'}, 'example.com?baz'); // 'example.com?baz&foo=123&bar=qux'

tinyQuery.remove('foo', 'example.com?foo=bar&baz'); // 'example.com?bar'
tinyQuery.remove(['foo', 'bar'], 'example.com?foo&bar&baz'); // 'example.com?baz'
tinyQuery.remove('example.com?foo=bar&baz', false); // 'example.com'
```

## Documentation

**Note:** The `text` argument always defaults to `window.location.search` if left unspecified, or `''` if `window` does not exist.

### .get()
> Alias for the `.getOne()`, `.getMany()` and `.getAll()` methods:

##### .getOne( name [, text] )
> Parse a URL to match a single key name, and return the corresponding value as a string or Boolean.

- **name** (_string_): The key to search for.
- **text** (_string_) [_optional_]: The URL text to search in.
```
tinyQuery.getOne('foo', 'example.com?foo=bar'); // 'bar'
tinyQuery.getOne('foo', 'example.com?foo'); // true
```

##### .getMany( names [, text] )
> Parse a URL to match an array of keys, and return the corresponding values in an object literal.

- **names** (_array_): The keys to search for.
- **text** (_string_) [_optional_]: The URL text to search in.
```
tinyQuery.getMany(['foo', 'bar', 'baz'], 'example.com?foo=123&baz'); // { foo: '123', bar: false, baz: true }
```

##### .getAll( [text] )
> Parse a URL and return all query-string values as an object.

> **Note:** If using the `.get()` alias with a specific text argument, pass `false` as the second argument (e.g. `tinyQuery.get('example.com?foo', false)`).

- **text** (_string_) [_optional_]: The URL text to search in.
```
tinyQuery.getAll('example.com?foo=bar&baz'); // { foo: 'bar', baz: true }
```

### .set()
> Alias for the `.setOne()` and `.setMany()` methods:

##### .setOne( name, value, [, text] )
> Add a single key (and its corresponding value) to the end of a URL.

- **name** (_string_): The key to add.
- **value** (_string|Boolean|number_): The corresponding value. If the value is a Boolean then only the key will be added.
- **text** (_string_) [_optional_]: The text URL to add the key/value to.
```
tinyQuery.setOne('foo', 'bar', 'example.com'); // 'example.com?foo=bar'
tinyQuery.setOne('foo', true, 'example.com'); // 'example.com?foo'
```

##### .setMany( values [, text] )
> Add several keys to a URL.

- **values** (_array|object_): The keys to add. Accepts an array of valueless keys, or an object literal of key/value pairs.
- **text** (_string_) [_optional_]: The text URL to add the key/value to.
```
tinyQuery.setMany(['foo', 'bar'], 'example.com'); // 'example.com?foo&bar'
tinyQuery.setMany({foo: 'bar', baz: true}, 'example.com'); // 'example.com?foo=bar&baz'
```

### .remove()
> Alias for the `.removeOne()`, `.removeMany()` and `.removeAll()` methods:


##### .removeOne( name [, text] )
> Remove a key from a URL query string, and return the updated URL.

- **name** (_string_): The key to remove.
- **text** (_string_) [_optional_]: The URL to parse and remove a key from.
```
tinyQuery.removeOne('foo', 'example.com?foo=bar&baz'); // 'example.com?baz'
```

##### .removeMany( names [, text] )
> Remove an array of keys from a URL query string, and return the updated URL.

- **names** (_array_): The keys to remove.
- **text** (_string_) [_optional_]: The URL to parse and remove keys from.
```
tinyQuery.removeMany(['foo', 'bar'], 'example.com?foo=123&bar&baz'); // 'example.com?baz'
```

##### .removeAll( [text] )
> Parse a URL and return all query-string values as an object.

> **Note:** If using the `.remove()` alias with a specific text argument, pass `false` as the second argument (e.g. `tinyQuery.remove('example.com?foo', false)`).

- **text** (_string_) [_optional_]: The URL text to search in.
```
tinyQuery.removeAll('example.com?foo=bar&baz'); // 'example.com'
```


## Contributing

Please read [contributing.md](contributing.md) for details on our code of conduct, and the process for working on this project and submitting pull requests.


## License

Copyright (c) Richard Westenra
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details