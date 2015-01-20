QUnit.test( "Test ActionsTest-object (js/classes/objects/Actions.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actions()
	
	// First test instanciation
	assert.ok( obj instanceof Actions, "Instantiation" );
	
	// Prepare
	assert.deepEqual(obj.getActions(), [], 'getObject: before add Action')
	
	var action1 = new Actor('L1')
	assert.ok(action1.getParamObj().addParam('state', 'on'), 'addParam: add reference parameter / Action')

	var action2 = new Actor('L2')
	assert.ok(action2.getParamObj().addParam('state',  'off'), 'addParam: add reference parameter / Action')

	// TODO Test with/add Actorgroup
	// var agroup = new Actorgroup()
	// agroup.getActors().addActor() ??? ÄHÄHÄHÄHÄH ???? !!! // TODO

	// Test Methods	
	assert.ok(obj.addAction(action1), 'addAction: add action 1')
	assert.ok(obj.addAction(action2), 'addAction: add action 2')
	assert.equal(obj.getActions(obj).length, 2, 'getActions: validate / proof if Action correct inserted')
	
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTOR":"L2","PARAMS":{"state":"off"}}]', 'toJSON: proof representation, direct call')

	//assert.ok(obj.removeObject(), 'removeObject')
	//assert.equal(JSON.stringify(obj.toJSON()), "{}", 'toJSON: proof representation, after removing')
	
})
