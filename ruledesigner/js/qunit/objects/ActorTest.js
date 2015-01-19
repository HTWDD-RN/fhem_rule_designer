QUnit.test( "Test Actor-object (js/classes/objects/Actor.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actor('2')
	
	// First test instantiation
	assert.ok( obj instanceof Actor, "Instantiation" );
	assert.equal( obj.getID(), 2, "ID validation" );
	
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
	assert.ok(obj.getParamObj().removeParam('dim'), 'Test Parameter löschbar')
	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"off"}', 'Test serialize JSON-Output')
	assert.ok(obj.getParamObj().addParam('dim', '75%'), 'Test Parameter hinzufügbar')
	assert.equal(JSON.stringify(obj.getParamObj().toJSON()), '{"state":"off","dim":"75%"}', 'Test serialize JSON-Output')
	assert.equal(obj.getParamObj().getParamValue('dim'), '75%', 'Test Parameter löschbar')

	// Test Param object tunneling
	assert.ok(obj.updateParam('state', 'Rule_2'),'updateParam: state')
	assert.ok(obj.getParameter(),'getParameter')
	assert.ok(obj.addParam('Test', 'Rule_1'),'addParam: Test')
	assert.equal(obj.getParamValue('state'), 'Rule_2','getParamValue')
	assert.ok(obj.removeParam('state'),'removeParam: state')
	assert.equal(obj.removeParam('state'),false,'removeParam: fail state')
	assert.ok(obj.setParameter(JSON.parse(JSON.stringify(test_params))),'setparameter')
			
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	
	assert.equal(JSON.stringify(obj.toJSON()), '{"ACTOR":"2","PARAMS":{"dim":"75%","Test":"Rule_1"}}', 'toJSON: function')	
	
	// Test unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '{"ACTOR":"2","PARAMS":{}}', 'toJSON: function')
})