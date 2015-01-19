QUnit.test( "Test Conditions-object (js/classes/objects/Conditions.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Conditions()
	
	// First test instanciation
	assert.ok( obj instanceof Conditions, "Instantiation" );
	
	// Prepare
	assert.equal(obj.getObject(), null, 'getObject: before add Condition')
	
	var gather = new Gather("AND")
	
	var cond1 = new Condition('CUL_WS')
	assert.ok(cond1.getRefParamObj().addRefParam('temperature', '>', 20), 'addRefParam: add reference parameter / condition')

	var cond2 = new Condition('CUL_WS2')
	assert.ok(cond2.getRefParamObj().addRefParam('humity', '>', 95), 'addRefParam: add reference parameter / condition')

	assert.ok(gather.addCondition(cond1), 'addCondition: add conditon 1')
	assert.ok(gather.addCondition(cond2), 'addCondition: add conditon 2')
	assert.equal(gather.getConditions(obj).length, 2, 'getConditions: validate / proof if condition correct inserted')

	// Test Methods	
	assert.ok(obj.addObject(gather), 'addObject: add gather')
	assert.equal(JSON.stringify(obj.toJSON()), '{"AND":[{"SENSOR":"CUL_WS","REF_PARAMS":{"temperature":[">",20]}},{"SENSOR":"CUL_WS2","REF_PARAMS":{"humity":[">",95]}}]}', 'toJSON: proof representation, direct call')
	assert.equal(JSON.stringify(obj.getObject().toJSON()), '{"AND":[{"SENSOR":"CUL_WS","REF_PARAMS":{"temperature":[">",20]}},{"SENSOR":"CUL_WS2","REF_PARAMS":{"humity":[">",95]}}]}', 'toJSON: proof representation, indirect call')

	assert.ok(obj.removeObject(), 'removeObject')
	assert.equal(JSON.stringify(obj.toJSON()), "{}", 'toJSON: proof representation, after removing')
	
	assert.ok(obj.addObject(gather), 'addObject: add gather')
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(gather.SYS_ID), gather, 'search: Test find gather')
	assert.ok(obj.search(gather.SYS_ID) === gather, 'search: Test find gather')
	assert.ok(obj.removeObject(gather), 'removeActor: '+ gather.SYS_ID)	
	assert.strictEqual(obj.search(gather.SYS_ID), null, 'search: Test not find gather strictEqual (null)')
	assert.ok(obj.search(gather.SYS_ID) !== gather, 'search: Test not find gather')
})
