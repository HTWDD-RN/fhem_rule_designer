QUnit.test( "Test Counter-object (js/classes/helpers/Counter.js)", function( assert ) {
	
	var count = new Counter()
	var tmp = count()
	for(var i = 0; i<100; i++){
		var tmp2 = count()
		assert.notEqual( tmp2, tmp, "Counting ("+tmp+"/"+tmp2+")")	
		tmp = tmp2
	}	
	delete count
});