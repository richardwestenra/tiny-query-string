const qs = require('./tinyQuery');
const { assert, expect } = require('chai');

describe('TinyQueryString', function(){
	describe('get', function(){
		it('should retrieve a named value from a query string', function() {
			expect(qs.get('foo', '?foo=bar')).to.equal('bar');
			expect(qs.get('foo', '?bar=foo')).to.not.be.true;
			expect(qs.get('foo', '?foo=bar&baz=quz')).to.equal('bar');
			expect(qs.get('foo', '?baz=quz&foo=bar')).to.equal('bar');
			expect(qs.get('foo', 'http://example.com/page/?foo=bar&baz=quz')).to.equal('bar');
			expect(qs.get('foo', 'http://www.example.com/page/?foo=bar&baz=quz')).to.equal('bar');
			expect(qs.get('foo', 'http://www.example.com?foo=bar&baz=quz')).to.equal('bar');
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
	});

	describe('getMany', function(){
		it('should retrieve multiple named values from a query string', function() {
			expect(qs.getMany(['foo'], '?foo')).to.be.an('array');
			expect(qs.getMany(['foo'], '?foo')).to.have.length(1);
			expect(qs.getMany(['foo'], '?foo=bar')[0]).to.equal('bar');
			expect(qs.getMany(['foo'], '?bar')[0]).to.not.be.true;
			expect(qs.getMany(['foo'], 'http://www.example.com/page/?foo=bar')[0]).to.equal('bar');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&baz=quz')[0]).to.equal('bar');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&baz=quz')[1]).to.equal('quz');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&quux=quz')[1]).to.not.be.true;
		});
		
		it('should confirm whether multiple keys are present in a query string', function() {
			expect(qs.getMany(['foo'], '?foo')[0]).to.be.true;
			expect(qs.getMany(['foo'], '?bar')[0]).to.not.be.true;
			expect(qs.getMany(['foo'], 'http://www.example.com/page/?foo&bar')[0]).to.be.true;
			expect(qs.getMany(['foo', 'bar'], '?foo&bar')[0]).to.be.true;
			expect(qs.getMany(['foo', 'bar'], '?foo&bar')[1]).to.be.true;
			expect(qs.getMany(['foo', 'bar'], '?foo&baz')[1]).to.not.be.true;
		});
	});

	describe('set', function(){
		it('should add a single key when none exists', function() {
			expect(qs.set('foo', 'bar', '')).to.equal('?foo=bar');
			expect(qs.set('foo', 'bar', '/')).to.equal('/?foo=bar');
			expect(qs.set('foo', 'bar', 'http://www.example.com/')).to.equal('http://www.example.com/?foo=bar');
		});
	});
});