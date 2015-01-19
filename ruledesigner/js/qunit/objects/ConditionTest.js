QUnit.test( "Test Condition-object (js/classes/objects/Condition.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Condition('')
	
	// First test instanciation
	assert.ok( obj instanceof Condition, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var refParams = obj.getRefParamObj()
	assert.ok((typeof refParams !== undefined && refParams instanceof RefParams), "RefParams object correct instanciated.")
	
	// Third test instantiation of helpers
	var vdev = new VirtualDevice( 'VD_DIGITAL_TIMER', true )
	assert.ok( vdev instanceof VirtualDevice, "Instantiation" );
	
	// Test Methods
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDevice: Test when no virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{"SENSOR":"","REF_PARAMS":{}}', 'toJSON: proof representation')

	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')	
	assert.ok(obj.getVirtualDevice(), 'getVirtualDevice: Test if virtual device set')
	assert.equal( JSON.stringify(obj.toJSON()), '{"SENSOR":"","REF_PARAMS":{},"VDEV":{"TYPE":"VD_DIGITAL_TIMER","REF_PARAMS":{}}}', 'toJSON: proof representation, no reference parameter found')

	assert.ok(obj.getRefParamObj().addRefParam('temperature', '>', 20), 'addRefParam: add reference parameter / condition')
	assert.equal( JSON.stringify(obj.toJSON()), '{"SENSOR":"","REF_PARAMS":{"temperature":[">",20]},"VDEV":{"TYPE":"VD_DIGITAL_TIMER","REF_PARAMS":{}}}', 'toJSON: proof representation')

	assert.ok(obj.removeVirtualDevice(), 'removeVirtualDevice: if virtual device set')
	assert.equal(obj.removeVirtualDevice(), false, 'removeVirtualDevice: if virtual device already removed')
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDevice: if virtual device already removed')
	assert.equal( JSON.stringify(obj.toJSON()), '{"SENSOR":"","REF_PARAMS":{"temperature":[">",20]}}', 'toJSON: proof representation')

	var test_params = JSON.parse(JSON.stringify(obj.getRefParameter()))
		// Test Param object tunneling
	assert.ok(obj.updateRefParam('temperature', '==', 'Rule_2', 6, 'Rule_1'),'updateParam: state')
	assert.ok(obj.getRefParameter(),'getParameter')
	assert.equal(obj.updateRefParam('state', '==', 'Rule_1'), false,'updateParam: Test fail')
	assert.ok(obj.addRefParam('state', '==', 'Rule_1'),'addParam: Test')
	assert.equal(obj.addRefParam('state', '==', 'Rule_1'), false,'addParam: Test fail')
	assert.deepEqual(obj.getRefParamValue('temperature'), ['==','Rule_2', 6, 'Rule_1'],'getRefParamValue')
	assert.ok(obj.removeRefParam('state'),'removeParam: state')
	assert.equal(obj.removeRefParam('state'),false,'removeParam: fail state')
	assert.ok(obj.setRefParameter(test_params),'setParameter')
	
	// Test search method
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDevice')	
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(vdev.SYS_ID), vdev, 'search: Test find subcondition')
	assert.ok(obj.removeVirtualDevice(), 'removeVirtualDevice: if virtual device set')
	assert.ok(obj.search(vdev.SYS_ID) !== vdev, 'search: Test find subcondition')
	
	
	//Test unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '{"SENSOR":"","REF_PARAMS":{}}', 'toJSON: function')
})