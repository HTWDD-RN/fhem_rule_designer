var _GatherList = [ [ "AND", -1 ], [ "OR", -1 ], [ "NOT", 1 ] ];

QUnit.test( "Test Gather-object (js/classes/objects/Gather.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Gather('AND')
	
	// First test instanciation
	assert.ok( obj instanceof Gather, "Instantiation" );
	
	// Second instantiation helper
	var cond1 = new Condition('CUL_WS')
	assert.ok(cond1.getRefParamObj().addRefParam('temperature', '>', 20), 'addRefParam: add reference parameter / condition')

	var cond2 = new Condition('CUL_WS2')
	assert.ok(cond2.getRefParamObj().addRefParam('humity', '>', 95), 'addRefParam: add reference parameter / condition')

	// Test Methods	
	assert.equal(obj.getLogical(), 'AND', 'getLocical: Test of "AND"')
	assert.equal(JSON.stringify(obj.toJSON()), '{"AND":[]}', 'toJSON: proof representation')
	
	assert.ok(obj.setLogical('OR'), 'Change locical Operator')
	assert.equal(obj.getLogical(), 'OR', 'getLocical: Test of "OR"')
	assert.notEqual(obj.getLogical(), 'NOT', 'getLocical: Test of "NOT"')
	assert.equal(JSON.stringify(obj.toJSON()), '{"OR":[]}', 'toJSON: proof representation')
	
	assert.ok(obj.addCondition(cond1), 'addCondition: add conditon 1')
	assert.ok(obj.addCondition(cond2), 'addCondition: add conditon 2')
	assert.equal(obj.getConditions(obj).length, 2, 'getConditions: validate / proof if condition correct inserted')

	assert.equal(JSON.stringify(obj.toJSON()), '{"OR":[{"SENSOR":"CUL_WS","REF_PARAMS":{"temperature":[">",20]}},{"SENSOR":"CUL_WS2","REF_PARAMS":{"humity":[">",95]}}]}', 'toJSON: proof representation')

	assert.ok(obj.removeCondition(cond1.SYS_ID), 'removeConditions: ID-variant')
	assert.equal(JSON.stringify(obj.toJSON()), '{"OR":[{"SENSOR":"CUL_WS2","REF_PARAMS":{"humity":[">",95]}}]}', 'toJSON: proof representation')
	assert.ok(obj.removeCondition(cond2), 'removeConditions: Object-variant')
	assert.equal(JSON.stringify(obj.toJSON()), '{"OR":[]}', 'toJSON: proof representation')
})
