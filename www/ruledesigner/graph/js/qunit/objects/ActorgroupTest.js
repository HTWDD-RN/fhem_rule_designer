QUnit.test( "Test Actorgroup-object (js/classes/objects/Actorgroup.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actorgroup()
	
	// First test instanciation
	assert.ok( obj instanceof Actorgroup, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var actorsObj = obj.getActors()
	assert.ok((typeof actorsObj !== undefined && actorsObj instanceof Actors), "Actors object correct instanciated.")
	
	// Third test instantiation of helpers
	var vdev = new VirtualDevice( 'VD_DIGITAL_TIMER' )
	assert.ok( vdev instanceof VirtualDevice, "Instantiation" );
	
	// Test Methods
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDevice: Test when no virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{}', 'toJSON: proof representation')
	
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')	
	assert.ok(obj.getVirtualDevice(), 'getVirtualDevice: Test if virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{"VDEV":{"TYPE":"VD_DIGITAL_TIMER","PARAMS":{}},"ACTORS":[]}', 'toJSON: proof representation')
	
	assert.ok(obj.removeVirtualDevice(), 'removeVirtualDevice: if virtual device set')
	assert.equal(obj.removeVirtualDevice(), false, 'removeVirtualDevice: if virtual device already removed')
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDevice: if virtual device already removed')
	assert.equal( JSON.stringify(obj.toJSON()), '{}', 'toJSON: proof representation')

})
