const qs = require('../tinyQuery');
const { assert, expect } = require('chai');

const encodedString = 'http%3A%2F%2Fwww.example.com%2Fpage%2F%3Ff%C3%B6o%3Dbar%20%C3%AFs%20%C3%A1%20pr%C3%A9tty%20c%C3%B6%C3%B6l%20w%C4%93bsite!';
const decodedString = 'http://www.example.com/page/?föo=bar ïs á prétty cööl wēbsite!';

describe('TinyQueryString', function(){

	describe('get', function(){
		it('should retrieve a named value from a query string', function() {
			expect(qs.get('foo', '?foo=bar')).to.equal('bar');
			expect(qs.get('foo', '?bar=foo')).to.not.be.true;
			expect(qs.get('foo', '?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.get('foo', '?baz=qux&foo=bar')).to.equal('bar');
			expect(qs.get('foo', 'http://example.com/page/?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.get('foo', 'http://www.example.com/page/?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.get('foo', 'http://www.example.com?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.get('foo', 'example.com?foo=bar')).to.equal('bar');
		});
		
		it('should confirm whether a key is present in a query string', function() {
			expect(qs.get('foo', '?foo')).to.be.true;
			expect(qs.get('foo', '?bar')).to.not.be.true;
			expect(qs.get('foo', 'http://www.example.com/page/?foo')).to.be.true;
			expect(qs.get('foo', 'http://www.example.com/page/?bar')).to.not.be.true;
			expect(qs.get('foo', '?foo&bar')).to.be.true;
			expect(qs.get('foo', '?foo&bar=baz')).to.be.true;
			expect(qs.get('foo', '?bar&baz')).to.not.be.true;
		});

		it('should be case-insensitive', function() {
			expect(qs.get('FOO', '?foo=bar')).to.equal('bar');
			expect(qs.get('foo', '?FOO=bar')).to.equal('bar');
		});

		it('should decode escape URI components', function() {
			expect(qs.get('foo', '?foo=' + encodedString)).to.equal(decodedString);
		});

		it('should retrieve multiple named values from a query string', function() {
			expect(qs.get(['foo'], '?foo')).to.be.an('object');
			expect(qs.get(['foo'], '?foo=bar')).to.deep.equal({foo:'bar'});
			expect(qs.get(['foo'], '?bar')).to.not.be.true;
			expect(qs.get(['foo'], 'http://www.example.com/page/?foo=bar')).to.deep.equal({foo:'bar'});
			expect(qs.get(['foo','baz'], '?foo=bar&baz=qux')).to.deep.equal({foo:'bar', baz:'qux'});
			expect(qs.get(['foo','baz'], '?foo=bar&quux=qux')).to.deep.equal({foo:'bar', baz:false});
		});
		
		it('should confirm whether multiple keys are present in a query string', function() {
			expect(qs.get(['foo'], '?foo')).to.deep.equal({foo:true});
			expect(qs.get(['foo'], '?bar')).to.deep.equal({foo:false});;
			expect(qs.get(['foo'], 'http://www.example.com/page/?foo&bar')).to.deep.equal({foo:true});
			expect(qs.get(['foo', 'bar'], '?foo&bar')).to.deep.equal({foo:true,bar:true});
			expect(qs.get(['foo', 'bar'], '?foo&baz')).to.deep.equal({foo:true,bar:false});
		});
	});


	describe('getAll', function(){
		it('should retrieve all of the keys and values from a string', function() {
			expect(qs.getAll('?foo&bar')).to.deep.equal({foo: true, bar: true});
			expect(qs.getAll('?foo=bar&baz=qux')).to.deep.equal({foo:'bar', baz:'qux'});
		});

		it('should return an empty object when there are no QS keys/values', function() {
			expect(qs.getAll('')).to.deep.equal({});
			expect(qs.getAll('/')).to.deep.equal({});
			expect(qs.getAll('?')).to.deep.equal({});
			expect(qs.getAll('http://www.example.com/page/')).to.deep.equal({});
			expect(qs.getAll('http://www.example.com/page/?')).to.deep.equal({});
		});
	});

	describe('set', function(){
		it('should add a single key when none exists', function() {
			expect(qs.set('foo', 'bar', '')).to.equal('?foo=bar');
			expect(qs.set('foo', 'bar')).to.equal('?foo=bar');
			expect(qs.set('foo', 123, '')).to.equal('?foo=123');
			expect(qs.set('foo', 'BAR', '')).to.equal('?foo=BAR');
			expect(qs.set('foo', 'bar', '/')).to.equal('/?foo=bar');
			expect(qs.set('foo', 'bar', 'http://www.example.com/')).to.equal('http://www.example.com/?foo=bar');
		});

		it('should add just the key name when the value is falsey', function() {
			expect(qs.set('foo', null, '')).to.equal('?foo');
			expect(qs.set('foo', false, '')).to.equal('?foo');
			expect(qs.set('foo', '', '')).to.equal('?foo');
			expect(qs.set('foo', undefined, '')).to.equal('?foo');
			expect(qs.set('foo', NaN, '')).to.equal('?foo');
			expect(qs.set('foo', 0, '')).to.equal('?foo');
			expect(qs.set(123, false, '')).to.equal('?123');
			expect(qs.set(true, false, '')).to.equal('?true');
			expect(qs.set(0, false, '')).to.equal('?0');
			expect(qs.set(Infinity, false, '')).to.equal('?Infinity');
		});

		it('should encode special characters', function() {
			expect(qs.set('foo', decodedString, '')).to.equal('?foo=' + encodedString);
		});

		it('should add multiple keys when none exist', function() {
			expect(qs.set(['foo', 'bar'], '')).to.equal('?foo&bar');
			expect(qs.set([false, true], '')).to.equal('?false&true');
			expect(qs.set([1, 0], '')).to.equal('?1&0');
			expect(qs.set(['foo', 'bar'], 'http://www.example.com/')).to.equal('http://www.example.com/?foo&bar');
			expect(qs.set(['foo','bar'], 'http://www.example.com/')).to.equal('http://www.example.com/?foo&bar');
		});

		it('should add multiple keys and their values', function() {
			expect(qs.set({foo:'bar',baz:'qux'}, '')).to.equal('?foo=bar&baz=qux');
			expect(qs.set({foo:123,baz:456}, '')).to.equal('?foo=123&baz=456');
			expect(qs.set({foo:false,baz:true}, '')).to.equal('?foo&baz=true');
			expect(qs.set({foo:'bar',baz:'qux'}, 'http://www.example.com/')).to.equal('http://www.example.com/?foo=bar&baz=qux');
		});

		it('should add multiple keys when some already exist', function() {
			expect(qs.set(
				{foo:'bar',baz:'qux'}, 
				'http://www.example.com/?corge=waldo'
			)).to.equal('http://www.example.com/?corge=waldo&foo=bar&baz=qux');
			expect(qs.set(['foo', 'bar'], '?baz&qux')).to.equal('?baz&qux&foo&bar');
		});
	});


	describe('remove', function(){
		it('should remove a key and its value from a query string', function() {
			expect(qs.remove('foo', '?foo=bar')).to.equal('');
			expect(qs.remove('foo', '?foo&bar')).to.equal('?bar');
			expect(qs.remove('foo', '?bar&foo')).to.equal('?bar');
			expect(qs.remove('foo', 'http://www.example.com/?bar&foo')).to.equal('http://www.example.com/?bar');
			expect(qs.remove('foo', 'http://www.example.com/?foo&bar')).to.equal('http://www.example.com/?bar');
		});

		it('should remove the \'?\' if there are no remaining QS keys', function() {
			expect(qs.remove('foo', '')).to.equal('');
			expect(qs.remove('foo', '?')).to.equal('');
			expect(qs.remove('foo', '/?')).to.equal('/');
			expect(qs.remove('foo', 'http://www.example.com/?foo')).to.equal('http://www.example.com/');
		});

		it('should remove keys and their values from a query string', function() {
			expect(qs.remove(['foo'], '?foo=bar')).to.equal('');
			expect(qs.remove(['foo','bar'], '?foo=bar')).to.equal('');
			expect(qs.remove(['foo','bar'], '?foo=baz&bar=qux')).to.equal('');
			expect(qs.remove(['foo'], '?foo&bar')).to.equal('?bar');
			expect(qs.remove(['foo','bar'], '?bar&foo')).to.equal('');
			expect(qs.remove(['foo','bar'], 'http://www.example.com/?bar&foo&baz')).to.equal('http://www.example.com/?baz');
			expect(qs.remove(['foo','bar'], 'http://www.example.com/?baz&foo&bar')).to.equal('http://www.example.com/?baz');
		});

		it('should remove the \'?\' if there are no remaining QS keys', function() {
			expect(qs.remove(['foo'], '')).to.equal('');
			expect(qs.remove(['foo','bar'], '?')).to.equal('');
			expect(qs.remove(['foo'], '/?')).to.equal('/');
			expect(qs.remove(['foo','bar'], 'http://www.example.com/?foo')).to.equal('http://www.example.com/');
		});
	});


	describe('removeAll', function(){
		it('should remove all keys and their values from a query string', function() {
			expect(qs.removeAll('?foo=bar')).to.equal('');
			expect(qs.removeAll('?foo&bar')).to.equal('');
			expect(qs.removeAll('?foo=baz&bar=qux')).to.equal('');
			expect(qs.removeAll('/?bar&foo')).to.equal('/');
			expect(qs.removeAll('http://www.example.com/?bar&foo&baz')).to.equal('http://www.example.com/');
			expect(qs.removeAll('http://www.example.com/?baz=foo&bar')).to.equal('http://www.example.com/');
		});
	});
});