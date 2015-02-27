QUnit.test( "Test Counter-object (js/classes/helpers/Counter.js)", function( assert ) {

	var obj = new Counter()
	var obj2 = new Counter()
	
	assert.equal(obj2(), 1, "Counting (2.1)")
	assert.equal(obj(), 1, "Counting (1.1)")
	assert.equal(obj(), 2, "Counting (1.2)")
	assert.equal(obj(), 3, "Counting (1.3)")
});