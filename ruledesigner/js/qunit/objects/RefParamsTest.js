QUnit.test( "Test RefParams-object (js/classes/objects/RefParams.js)", function( assert ) {

	// Create instance of object which is testing
	var obj = new RefParams()
	
	// First test instantiation
	assert.ok( obj instanceof RefParams, "Instantiation" );  
	
	// Test general setting AND JSON-Output
	var test_params = {}
	test_params['humidty'] = [ '>', 95]
	test_params['temperature_outdoor'] = ['<', 3]
	test_params['temperature_indoor'] = [ 'between', '20', 24 ]	
	assert.ok(obj.setRefParameter(test_params), "setRefParameter")	
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = { a:'between', b:'20', c:24 }	
	assert.equal(obj.setRefParameter(test_params2), false, "setRefParameter: fail, one of it is an Object")
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = { a:'between', b:'20' }	
	assert.equal(obj.setRefParameter(test_params2), false, "setRefParameter: fail, one of it is an Object")
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = { a:'between' }	
	assert.equal(obj.setRefParameter(test_params2), false, "setRefParameter: fail, one of it is an Object")

		var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = 9
	assert.equal(obj.setRefParameter(test_params2), false, "setRefParameter: fail, one of it is no Array")
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = [ 'between', '20' ]	
	assert.equal(obj.setRefParameter(test_params2), true, "setRefParameter: legal array")
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	test_params2['temperature_indoor2'] = [ 'between' ]	
	assert.equal(obj.setRefParameter(test_params2), false, "setRefParameter: fail, array has lower than two elements")
	
	var test_params2=JSON.parse(JSON.stringify(test_params))
	assert.equal(obj.setRefParameter(test_params2), true, "setRefParameter: legal array")
	
	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":[">",95],"temperature_outdoor":["<",3],"temperature_indoor":["between","20",24]}', 'toJSON: function')

	assert.equal(obj.getRefParamValue('wind_speed'), null, 'getRefParamValue: result null - wind speed param not defined')
	assert.ok(obj.addRefParam('wind_speed', '>', 10 ), 'addRefParam: Wind speed param added!')
	assert.equal(obj.addRefParam('wind_speed', '>', 11 ), false, 'addRefParam: Wind speed param already exists!')

	assert.deepEqual(obj.getRefParamValue('wind_speed'), ['>', 10], 'getRefParamRefValue: of wind speed')

	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":[">",95],"temperature_outdoor":["<",3],"temperature_indoor":["between","20",24],"wind_speed":[">",10]}', 'toJSON: function')

	assert.ok(obj.updateRefParam('temperature_outdoor', '>', 12), 'updateRefParam: temperature')
	assert.equal(obj.updateRefParam('temperature2', '=', 23), false, 'updateRefParam: temperature2 not exists')
	assert.equal(JSON.stringify(obj.toJSON()), '{"humidty":[">",95],"temperature_outdoor":[">",12],"temperature_indoor":["between","20",24],"wind_speed":[">",10]}', 'toJSON: function')

	assert.ok(obj.removeRefParam('humidty'), 'deleteRefParam: temperature')
	assert.equal(JSON.stringify(obj.toJSON()), '{"temperature_outdoor":[">",12],"temperature_indoor":["between","20",24],"wind_speed":[">",10]}', 'toJSON: function')

});