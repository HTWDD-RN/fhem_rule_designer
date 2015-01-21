QUnit.test( "Test GlobalCounter-object (js/runQUnit.html)", function( assert ) {
	var tmp = cSYS_ID()
	for(var i = 0; i<10; i++){
		var tmp2 = cSYS_ID()
		assert.notEqual( tmp2, tmp, "Counting ("+tmp+"/"+tmp2+")")	
		tmp = tmp2
	}
});