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
	assert.equal( JSON.stringify(obj.toJSON()), '{"ACTORGROUP":{}}', 'toJSON: proof representation')
	
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')	
	assert.ok(obj.getVirtualDevice(), 'getVirtualDevice: Test if virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{"ACTORGROUP":{"VDEV":{"TYPE":"VD_DIGITAL_TIMER","PARAMS":{}},"ACTORS":[]}}', 'toJSON: proof representation')
	
	assert.ok(obj.removeVirtualDevice(), 'removeVirtualDevice: if virtual device set')
	assert.equal(obj.removeVirtualDevice(), false, 'removeVirtualDevice: if virtual device already removed')
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDevice: if virtual device already removed')
	assert.equal( JSON.stringify(obj.toJSON()), '{"ACTORGROUP":{}}', 'toJSON: proof representation')
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')
	
	// Test search method
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(vdev.SYS_ID), vdev, 'search: Test find vdev')
	assert.ok(obj.search(vdev.SYS_ID) === vdev, 'search: Test find vdev')
	assert.ok(obj.removeVirtualDevice(vdev), 'removeActor: '+ vdev.SYS_ID)	
	assert.strictEqual(obj.search(vdev.SYS_ID), -1, 'search: Test not find vdev strictEqual (-1)')
	assert.ok(obj.search(vdev.SYS_ID) !== vdev, 'search: Test not find vdev')
					
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')	
	assert.ok(obj.getVirtualDevice(), 'getVirtualDevice: Test if virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{"ACTORGROUP":{"VDEV":{"TYPE":"VD_DIGITAL_TIMER","PARAMS":{}},"ACTORS":[]}}', 'toJSON: proof representation')
	
	// Tst unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '{"ACTORGROUP":{}}', 'toJSON: function')
})
