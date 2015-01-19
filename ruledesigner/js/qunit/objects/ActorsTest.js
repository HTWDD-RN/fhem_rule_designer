QUnit.test( "Test Actors-object (js/classes/objects/Actors.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actors()
	
	// First test instantiation
	assert.ok( obj instanceof Actors, "Instantiation" );
	
	//Prepare
	var actor1 = new Actor('ID1')
	var actor4 = new Actor('ID4')
	
	// Test methods	
	assert.ok(obj.addActor(actor1), 'addActor first actor')
	assert.ok(obj.addActor(new Actor('ID2')), 'addActor second')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID1","PARAMS":{}},{"ACTOR":"ID2","PARAMS":{}}]','toJSON: proof representation')
	
	assert.ok(obj.addActor(new Actor('ID3')), 'addActor third')
	assert.ok(obj.addActor(actor4), 'addActor forth')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID1","PARAMS":{}},{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}},{"ACTOR":"ID4","PARAMS":{}}]','toJSON: proof representation')

	assert.ok(obj.removeActor(actor1.SYS_ID), 'removeActor first')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}},{"ACTOR":"ID4","PARAMS":{}}]','toJSON: proof representation')

	assert.ok(obj.removeActor(actor4.SYS_ID), 'removeActor forth')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}}]','toJSON: proof representation')
	
	var actorsObj = obj.getActors()
	assert.equal(actorsObj.length, 2, 'getActors: proof number of stored actors')
	while(actorsObj.length)
		obj.removeActor(actorsObj[0])
	
	assert.equal(obj.getActors().length, 0, 'getActors: proof number of stored actors')
	
			
	assert.ok(obj.addActor(actor1), 'addActor forth')
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(actor1.SYS_ID), actor1, 'search: Test find actor1')
	assert.ok(obj.search(actor1.SYS_ID) === actor1, 'search: Test find actor1')
	assert.ok(obj.removeActor(actor1), 'removeActor: '+ actor1.SYS_ID)	
	assert.strictEqual(obj.search(actor1.SYS_ID), null, 'search: Test not find actor1 strictEqual (null)')
	assert.ok(obj.search(actor1.SYS_ID) !== actor1, 'search: Test not find actor1')
})
