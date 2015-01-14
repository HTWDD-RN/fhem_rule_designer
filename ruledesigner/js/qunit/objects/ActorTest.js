QUnit.test( "Test Actor-object (js/classes/objects/Actor.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actor()
	
	// First test instantiation
	assert.ok( obj instanceof Actor, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var paramObj = obj.getParamObj()
	assert.ok( (typeof paramObj !== undefined && paramObj instanceof Params) , "Params object correct instanciated.")
	
	var test_params = {}
	test_params['state'] = 'on'
	test_params['dim'] = '80%'
	
	// Method test
	assert.ok(obj.getParamObj().setParameter(test_params), "setParameter")	

	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"on","dim":"80%"}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().updateParam('state', 'off'), 'Test Parameter aktualisierbar')
	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"off","dim":"80%"}', 'Test serializeParams JSON-Output')
	assert.ok(obj.getParamObj().deleteParam('dim'), 'Test Parameter löschbar')
	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"off"}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().addParam('dim', '75%'), 'Test Parameter hinzufügbar')
	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"off","dim":"75%"}', 'Test serialize JSON-Output')
	assert.equal(obj.getParamObj().getParamValue('dim'), '75%', 'Test Parameter löschbar')

})