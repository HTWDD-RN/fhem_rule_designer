QUnit.test( "Test Actors-object (js/classes/objects/Actors.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actors()
	
	// First test instantiation
	assert.ok( obj instanceof Actors, "Instantiation" );
	
	// Test methods	
	assert.ok(obj.addActor(new Actor('ID1')), 'addActor first actor')
	assert.ok(obj.addActor(new Actor('ID2')), 'addActor second')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID1","PARAMS":{}},{"ACTOR":"ID2","PARAMS":{}}]','toJSON: proof representation')
	
	assert.ok(obj.addActor(new Actor('ID3')), 'addActor third')
	assert.ok(obj.addActor(new Actor('ID4')), 'addActor forth')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID1","PARAMS":{}},{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}},{"ACTOR":"ID4","PARAMS":{}}]','toJSON: proof representation')

	assert.ok(obj.removeActor('ID1'), 'removeActor first')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}},{"ACTOR":"ID4","PARAMS":{}}]','toJSON: proof representation')

	assert.ok(obj.removeActor('ID4'), 'removeActor forth')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"ID2","PARAMS":{}},{"ACTOR":"ID3","PARAMS":{}}]','toJSON: proof representation')
	
	var actorsObj = obj.getActors()
	assert.equal(actorsObj.length, 2, 'getActors: proof number of stored actors')
	while(actorsObj.length)
		obj.removeActor(actorsObj[0])
	
	assert.equal(obj.getActors().length, 0, 'getActors: proof number of stored actors')
})
