QUnit.test( "Test Params-object (js/classes/objects/Params.js)", function( assert ) {

	// Create instance of object which is testing
	var obj = new Params()
	
	// First test instantiation
	assert.ok( obj instanceof Params, "Instantiation" );
  
	
	// Test general setting AND JSON-Output
	var test_params = {}
	test_params['humidty'] = 95
	test_params['temperature'] = 3
	
	assert.ok(obj.setParameter(test_params), "setParameter")
	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":95,"temperature":3}', 'toJSON: function')


	assert.equal(obj.getParamValue('wind_speed'), null, 'getParamValue: result null - wind speed param not defined')
	assert.ok(obj.addParam('wind_speed', 5), 'addParam: Wind speed param added!')
	assert.equal(obj.addParam('wind_speed', 5), false, 'addParam: Wind speed param added!')
	assert.equal(obj.getParamValue('wind_speed'), 5, 'getParamValue: of wind speed')

	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":95,"temperature":3,"wind_speed":5}', 'toJSON: function')

	assert.ok(obj.updateParam('temperature', 6), 'updateParam: temperature')
	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":95,"temperature":6,"wind_speed":5}', 'toJSON: function')

	assert.ok(obj.removeParam('temperature'), 'deleteParam: temperature')
	assert.equal(obj.updateParam('temperature', 6), false, 'updateParam: temperature after remove')
	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":95,"wind_speed":5}', 'toJSON: function')

});