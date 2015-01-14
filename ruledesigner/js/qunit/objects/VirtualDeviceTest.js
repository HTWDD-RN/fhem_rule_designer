QUnit.test( "Test VirtualDevice-object (js/classes/objects/VirtualDevice.js) ACTORS MODE1", function( assert ) {
	// Create instance of object which is testing
	var obj = new VirtualDevice(1)
	
	// First test instantiation
	assert.ok( obj instanceof VirtualDevice, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var paramObj = obj.getParamObj()
	assert.ok( (typeof paramObj !== undefined && (paramObj instanceof Params)) , "Params object correct instanciated.")
	
	var test_params = {}
	test_params['humidty'] = 97
	test_params['temperature'] = 6
	
	assert.ok(obj.getParamObj().setParameter(test_params), "setParameter")	
	
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":1,"PARAMS":{"humidty":97,"temperature":6}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().updateParam('humidty', '95'), 'Test Parameter aktualisierbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":1,"PARAMS":{"humidty":"95","temperature":6}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().deleteParam('humidty'), 'Test Parameter löschbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":1,"PARAMS":{"temperature":6}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().addParam('temperature_indoor', '20'), 'Test Parameter hinzufügbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":1,"PARAMS":{"temperature":6,"temperature_indoor":"20"}}', 'Test serialize JSON-Output')
	assert.equal(obj.getParamObj().getParamValue('temperature'), '6', 'Test Parameter löschbar')
	
})

QUnit.test( "Test VirtualDevice-object (js/classes/objects/VirtualDevice.js) ACTORS MODE2", function( assert ) {
	// Create instance of object which is testing
	var obj = new VirtualDevice(2, false)
	
	// First test instantiation
	assert.ok( obj instanceof VirtualDevice, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var paramObj = obj.getParamObj()
	assert.ok( (typeof paramObj !== undefined && (paramObj instanceof Params)) , "Params object correct instanciated.")
	
	// Prepare
	var test_params = {}
	test_params['humidty'] = 96
	test_params['temperature'] = 15
	
	// Test methods
	assert.ok(obj.getParamObj().setParameter(test_params), "setParameter")	
	
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":2,"PARAMS":{"humidty":96,"temperature":15}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().updateParam('humidty', '95'), 'Test Parameter aktualisierbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":2,"PARAMS":{"humidty":"95","temperature":15}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().deleteParam('humidty'), 'Test Parameter löschbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":2,"PARAMS":{"temperature":15}}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().addParam('temperature_indoor', '20'), 'Test Parameter hinzufügbar')
	assert.equal(JSON.stringify(obj.toJSON()), '{"TYPE":2,"PARAMS":{"temperature":15,"temperature_indoor":"20"}}', 'Test serialize JSON-Output')
	assert.equal(obj.getParamObj().getParamValue('temperature'), '15', 'Test Parameter löschbar')
})

QUnit.test( "Test VirtualDevice-object (js/classes/objects/VirtualDevice.js) REFERENCE MODE", function( assert ) {
	// Create instance of object which is testing
	var refObj = new VirtualDevice(11, true)
	
	// First test instantiation
	assert.ok( refObj instanceof VirtualDevice, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var paramObj = refObj.getParamObj()
	assert.ok( typeof paramObj !== undefined && paramObj instanceof RefParams , "RefParams object correct instanciated.")
	
	// Prepare
	var test_params = {}
	test_params['humidty'] = [ '>', 95]
	test_params['temperature_outdoor'] = ['<', 3]
	test_params['temperature_indoor'] = [ 'between', '20', 24 ]
	
	// Test methods
	assert.ok(refObj.getParamObj().setRefParameter(test_params), "setRefParameter")	
	assert.equal(JSON.stringify(refObj.toJSON()), '{"TYPE":11,"REF_PARAMS":{"humidty":[">",95],"temperature_outdoor":["<",3],"temperature_indoor":["between","20",24]}}', 'Test serialize JSON-Output')
	assert.ok(refObj.getParamObj().updateRefParam('humidty', '<', 95), 'Test Parameter aktualisierbar')
	assert.equal(JSON.stringify(refObj.toJSON()), '{"TYPE":11,"REF_PARAMS":{"humidty":["<",95],"temperature_outdoor":["<",3],"temperature_indoor":["between","20",24]}}', 'Test serialize JSON-Output')
	assert.ok(refObj.getParamObj().deleteRefParam('temperature_outdoor'), 'Test Parameter löschbar')
	assert.equal(JSON.stringify(refObj.toJSON()), '{"TYPE":11,"REF_PARAMS":{"humidty":["<",95],"temperature_indoor":["between","20",24]}}', 'Test serialize JSON-Output')
	assert.ok(refObj.getParamObj().addRefParam('temperature_outdoor', 'between', 19.5, 20.5), 'Test Parameter hinzufügbar')
	assert.equal(JSON.stringify(refObj.toJSON()), '{"TYPE":11,"REF_PARAMS":{"humidty":["<",95],"temperature_indoor":["between","20",24],"temperature_outdoor":["between",19.5,20.5]}}', 'Test serialize JSON-Output')
	assert.deepEqual(refObj.getParamObj().getRefParamValue('humidty'), ["<",95], 'Test Parameter löschbar')
})