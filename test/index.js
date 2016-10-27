const qs = require('../tinyQuery');
const { assert, expect } = require('chai');

const encodedString = 'http%3A%2F%2Fwww.example.com%2Fpage%2F%3Ff%C3%B6o%3Dbar%20%C3%AFs%20%C3%A1%20pr%C3%A9tty%20c%C3%B6%C3%B6l%20w%C4%93bsite!';
const decodedString = 'http://www.example.com/page/?föo=bar ïs á prétty cööl wēbsite!';

describe('TinyQueryString', function(){

	describe('getOne', function(){
		it('should retrieve a named value from a query string', function() {
			expect(qs.getOne('foo', '?foo=bar')).to.equal('bar');
			expect(qs.getOne('foo', '?bar=foo')).to.not.be.true;
			expect(qs.getOne('foo', '?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.getOne('foo', '?baz=qux&foo=bar')).to.equal('bar');
			expect(qs.getOne('foo', 'http://example.com/page/?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.getOne('foo', 'http://www.example.com/page/?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.getOne('foo', 'http://www.example.com?foo=bar&baz=qux')).to.equal('bar');
			expect(qs.getOne('foo', 'example.com?foo=bar')).to.equal('bar');
		});
		
		it('should confirm whether a key is present in a query string', function() {
			expect(qs.getOne('foo', '?foo')).to.be.true;
			expect(qs.getOne('foo', '?bar')).to.not.be.true;
			expect(qs.getOne('foo', 'http://www.example.com/page/?foo')).to.be.true;
			expect(qs.getOne('foo', 'http://www.example.com/page/?bar')).to.not.be.true;
			expect(qs.getOne('foo', '?foo&bar')).to.be.true;
			expect(qs.getOne('foo', '?foo&bar=baz')).to.be.true;
			expect(qs.getOne('foo', '?bar&baz')).to.not.be.true;
		});

		it('should be case-insensitive', function() {
			expect(qs.getOne('FOO', '?foo=bar')).to.equal('bar');
			expect(qs.getOne('foo', '?FOO=bar')).to.equal('bar');
		});

		it('should decode escape URI components', function() {
			expect(qs.getOne('foo', '?foo=' + encodedString)).to.equal(decodedString);
		});
	});


	describe('getMany', function(){
		it('should retrieve multiple named values from a query string', function() {
			expect(qs.getMany(['foo'], '?foo')).to.be.an('array');
			expect(qs.getMany(['foo'], '?foo')).to.have.length(1);
			expect(qs.getMany(['foo'], '?foo=bar')[0]).to.equal('bar');
			expect(qs.getMany(['foo'], '?bar')[0]).to.not.be.true;
			expect(qs.getMany(['foo'], 'http://www.example.com/page/?foo=bar')[0]).to.equal('bar');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&baz=qux')[0]).to.equal('bar');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&baz=qux')[1]).to.equal('qux');
			expect(qs.getMany(['foo', 'baz'], '?foo=bar&quux=qux')[1]).to.not.be.true;
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


	describe('getAll', function(){
		it('should retrieve all of the keys and values from a string', function() {
			expect(qs.getAll('?foo&bar')[0]).to.equal('foo');
			expect(qs.getAll('?foo&bar')[1]).to.equal('bar');
			expect(qs.getAll('?foo=bar&baz=qux')[0].name).to.equal('foo');
			expect(qs.getAll('?foo=bar&baz=qux')[0].value).to.equal('bar');
			expect(qs.getAll('?foo=bar&baz=qux')[1].name).to.equal('baz');
			expect(qs.getAll('?foo=bar&baz=qux')[1].value).to.equal('qux');
		});

		it('should return an empty array when there are no QS keys/values', function() {
			expect(qs.getAll('')).to.deep.equal([]);
			expect(qs.getAll('/')).to.deep.equal([]);
			expect(qs.getAll('?')).to.deep.equal([]);
			expect(qs.getAll('http://www.example.com/page/')).to.deep.equal([]);
			expect(qs.getAll('http://www.example.com/page/?')).to.deep.equal([]);
		});
	});


	describe('get', function(){
		it('should behave the same as getOne', function() {
			expect(qs.get('foo', '?foo=bar')).to.equal(qs.getOne('foo', '?foo=bar'));
		});
		
		it('should behave the same as getMany', function() {
			expect(qs.get(['foo'], '?foo')).to.deep.equal(qs.getMany(['foo'], '?foo'));
			expect(qs.get(['foo','bar'], '?foo&bar')).to.deep.equal(qs.getMany(['foo','bar'], '?foo&bar'));
			expect(qs.get(['foo','bar'], '?foo=bar&baz=qux')).to.deep.equal(qs.getMany(['foo','bar'], '?foo=bar&baz=qux'));
		});

		it('should behave the same as getAll', function() {
			expect(qs.get('')).to.deep.equal(qs.getAll(''));
			expect(qs.get('?foo&bar')).to.deep.equal(qs.getAll('?foo&bar'));
			expect(qs.get('?foo=bar&baz=qux')).to.deep.equal(qs.getAll('?foo=bar&baz=qux'));
		});
	});


	describe('setOne', function(){
		it('should add a single key when none exists', function() {
			expect(qs.setOne('foo', 'bar', '')).to.equal('?foo=bar');
			expect(qs.setOne('foo', 'bar')).to.equal('?foo=bar');
			expect(qs.setOne('foo', 123, '')).to.equal('?foo=123');
			expect(qs.setOne('foo', 'BAR', '')).to.equal('?foo=BAR');
			expect(qs.setOne('foo', 'bar', '/')).to.equal('/?foo=bar');
			expect(qs.setOne('foo', 'bar', 'http://www.example.com/')).to.equal('http://www.example.com/?foo=bar');
		});

		it('should add just the key name when the value is falsey', function() {
			expect(qs.setOne('foo', null, '')).to.equal('?foo');
			expect(qs.setOne('foo', false, '')).to.equal('?foo');
			expect(qs.setOne('foo', '', '')).to.equal('?foo');
			expect(qs.setOne('foo', undefined, '')).to.equal('?foo');
			expect(qs.setOne('foo', NaN, '')).to.equal('?foo');
			expect(qs.setOne('foo', 0, '')).to.equal('?foo');
			expect(qs.setOne(123, false, '')).to.equal('?123');
			expect(qs.setOne(true, false, '')).to.equal('?true');
			expect(qs.setOne(0, false, '')).to.equal('?0');
			expect(qs.setOne(Infinity, false, '')).to.equal('?Infinity');
		});

		it('should encode special characters', function() {
			expect(qs.setOne('foo', decodedString, '')).to.equal('?foo=' + encodedString);
		});
	});


	describe('setMany', function(){
		it('should add multiple keys when none exist', function() {
			expect(qs.setMany([ {name:'foo'}, {name:'bar'} ], '')).to.equal('?foo&bar');
			expect(qs.setMany(['foo', 'bar'], '')).to.equal('?foo&bar');
			expect(qs.setMany([false, true], '')).to.equal('?false&true');
			expect(qs.setMany([1, 0], '')).to.equal('?1&0');
			expect(qs.setMany(['foo', 'bar'], 'http://www.example.com/')).to.equal('http://www.example.com/?foo&bar');
			expect(qs.setMany([ {name:'foo'}, {name:'bar'} ], 'http://www.example.com/')).to.equal('http://www.example.com/?foo&bar');
		});

		it('should add multiple keys and their values', function() {
			expect(qs.setMany([ {name:'foo', value:'bar'}, {name:'baz', value:'qux'} ], '')).to.equal('?foo=bar&baz=qux');
			expect(qs.setMany([ {name:'foo', value:123}, {name:'baz', value:456} ], '')).to.equal('?foo=123&baz=456');
			expect(qs.setMany([ {name:'foo', value:false}, {name:'baz', value:true} ], '')).to.equal('?foo&baz=true');
			expect(qs.setMany([ {name:'foo', value:'bar'}, {name:'baz', value:'qux'} ], 'http://www.example.com/')).to.equal('http://www.example.com/?foo=bar&baz=qux');
		});

		it('should add multiple keys when some already exist', function() {
			expect(qs.setMany(
				[ {name:'foo', value:'bar'}, {name:'baz', value:'qux'} ], 
				'http://www.example.com/?corge=waldo'
			)).to.equal('http://www.example.com/?corge=waldo&foo=bar&baz=qux');
			expect(qs.setMany(['foo', 'bar'], '?baz&qux')).to.equal('?baz&qux&foo&bar');
		});
	});


	describe('set', function(){
		it('should behave the same as setOne', function() {
			expect(qs.set('foo', 'bar', '')).to.equal(qs.setOne('foo', 'bar', ''));
			expect(qs.set('foo', false, '')).to.equal(qs.setOne('foo', false, ''));
		});
		
		it('should behave the same as setMany', function() {
			expect(qs.set(['foo'], '')).to.equal(qs.setMany(['foo'], ''));
			expect(qs.set(['foo','bar'], '')).to.equal(qs.setMany(['foo','bar'], ''));
			expect(
				qs.setMany([ {name:'foo', value:'bar'}, {name:'baz', value:'qux'} ], '')
			).to.equal(
				qs.setMany([ {name:'foo', value:'bar'}, {name:'baz', value:'qux'} ], '')
			);
		});
	});


	describe('removeOne', function(){
		it('should remove a keys and its values from a query string', function() {
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
	});


	describe('removeMany', function(){
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
			expect(qs.remove('?foo=bar')).to.equal('');
			expect(qs.remove('?foo&bar')).to.equal('');
			expect(qs.remove('?foo=baz&bar=qux')).to.equal('');
			expect(qs.remove('/?bar&foo')).to.equal('/');
			expect(qs.remove('http://www.example.com/?bar&foo&baz')).to.equal('http://www.example.com/');
			expect(qs.remove('http://www.example.com/?baz=foo&bar')).to.equal('http://www.example.com/');
		});
	});


	describe('remove', function(){
		it('should behave the same as removeOne', function() {
			expect(qs.remove('foo', '?foo=bar')).to.equal(qs.removeOne('foo', '?foo=bar'));
		});
		
		it('should behave the same as removeMany', function() {
			expect(qs.remove(['foo'], '?foo')).to.deep.equal(qs.removeMany(['foo'], '?foo'));
			expect(qs.remove(['foo','bar'], '?foo&bar')).to.deep.equal(qs.removeMany(['foo','bar'], '?foo&bar'));
			expect(qs.remove(['foo','bar'], '/?foo=bar&baz=qux')).to.deep.equal(qs.removeMany(['foo','bar'], '/?foo=bar&baz=qux'));
		});

		it('should behave the same as removeAll', function() {
			expect(qs.remove('')).to.deep.equal(qs.removeAll(''));
			expect(qs.remove('?foo&bar')).to.deep.equal(qs.removeAll('?foo&bar'));
			expect(qs.remove('/?foo=bar&baz=qux')).to.deep.equal(qs.removeAll('/?foo=bar&baz=qux'));
		});
	});
});