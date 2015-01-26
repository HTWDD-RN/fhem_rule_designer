QUnit.test( "Test ActionsTest-object (js/classes/objects/Actions.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Actions()
	
	// First test instanciation
	assert.ok( obj instanceof Actions, "Instantiation" );
	
	// Prepare
	assert.deepEqual(obj.getActions(), {}, 'getObject: before add Action')
	
	var actor1 = new Actor('L1')
	assert.ok(actor1.getParamObj().addParam('state', 'on'), 'addParam: add reference parameter / Action')

	var actor2 = new Actor('L2')
	assert.ok(actor2.getParamObj().addParam('state',  'off'), 'addParam: add reference parameter / Action')

	var actor3 = new Actor('L3')
	assert.ok( actor3 instanceof Actor, "Instantiation Actor1" );
	assert.equal( actor3.getID(), 'L3', "Actor3 - ID validation" );
	assert.ok(actor3.getParamObj().addParam('state', 'off'),  'addParam: state')
	
	var actor4 = new Actor('TV')
	assert.ok( actor4 instanceof Actor, "Instantiation Actor2" );
	assert.equal( actor4.getID(), 'TV', "Actor4 - ID validation" );
	assert.ok(actor4.getParamObj().addParam('state', 'on'), 'addParam: state')

	var actorgroup = new Actorgroup()
	assert.ok( actorgroup instanceof Actorgroup, "Instantiation Actorgroup" );
	assert.ok(actorgroup.getActors().addActor(actor3), 'addActor: '+ actor3.SYS_ID)
	assert.ok(actorgroup.getActors().addActor(actor4), 'addActor: '+ actor4.SYS_ID)
	assert.ok(actorgroup.getActors().removeActor(actor3.SYS_ID), 'removeActor: '+ actor3.SYS_ID)
	assert.equal(actorgroup.getActors().removeActor(actor3),false, 'removeActor: '+ actor3.SYS_ID)
	assert.ok(actorgroup.getActors().addActor(actor3), 'addActor: '+ actor3.SYS_ID)
	assert.ok(actorgroup.getActors().removeActor(actor3), 'removeActor: '+ actor3.SYS_ID)
	assert.equal(actorgroup.getActors().removeActor(actor3),false, 'removeActor: '+ actor3.SYS_ID)
	assert.ok(actorgroup.getActors().addActor(actor3), 'addActor: '+ actor3.SYS_ID)

	var vdev = new VirtualDevice( 'VD_DELAY_TIMER' )
	assert.ok( vdev instanceof VirtualDevice, "Instantiation VitualDevice" );
	assert.equal( vdev.getID(), 'VD_DELAY_TIMER', "VitualDevice - ID validation" );
	
	// Test Methods	
	
	assert.ok(obj.addAction(actor1), 'addActor: add actor 1')
	assert.ok(obj.addAction(actor2), 'addActor: add actor 2')
	assert.equal(Object.keys(obj.getActions()).length, 2, 'getActions: validate / proof if Action correct inserted')
	
	assert.strictEqual(obj.getAction(actor1.SYS_ID), actor1, 'getAction: comparing')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTOR":"L2","PARAMS":{"state":"off"}}]', 'toJSON: proof representation, direct call')

	
	assert.ok(obj.addAction(actorgroup), 'addActor: add actorgroup')
	assert.strictEqual(obj.getAction(actorgroup.SYS_ID), actorgroup, 'getAction: comparing')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTOR":"L2","PARAMS":{"state":"off"}},{"ACTORGROUP":{}}]', 'toJSON: proof representation, after removing, before add virtual device')

	assert.ok(actorgroup.setVirtualDevice(vdev), 'setVirtualDevice')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTOR":"L2","PARAMS":{"state":"off"}},{"ACTORGROUP":{"VDEV":{"TYPE":"VD_DELAY_TIMER","PARAMS":{}},"ACTORS":[{"ACTOR":"TV","PARAMS":{"state":"on"}},{"ACTOR":"L3","PARAMS":{"state":"off"}}]}}]', 'toJSON: proof representation, after removing, before add virtual device')

	assert.ok(actorgroup.removeVirtualDevice(), 'removetVirtualDevice')
	assert.ok(obj.removeAction(actor2), 'removeAction2')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTORGROUP":{}}]', 'toJSON: proof representation, after removing')
	
	
	// Test search method
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(actor1.SYS_ID), actor1, 'search: Test find actor1')
	assert.ok(obj.search(actor1.SYS_ID) === actor1, 'search: Test find actor1')
	assert.ok(obj.removeAction(actor1), 'removeActor: '+ actor1.SYS_ID)	
	assert.strictEqual(obj.search(actor1.SYS_ID), -1, 'search: Test not find actor1 strictEqual (-1)')
	assert.ok(obj.search(actor1.SYS_ID) !== actor1, 'search: Test not find actor1')
				
	// Test unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '[]', 'toJSON: function')
	
	// Test addObject
	assert.ok(obj.addAction(actor1), 'addActor: add actor 1')
	assert.ok(obj.addAction(actor2), 'addActor: add actor 2')
	assert.ok(obj.addAction(actorgroup), 'addActor: add actorgroup')
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ACTOR":"L1","PARAMS":{"state":"on"}},{"ACTOR":"L2","PARAMS":{"state":"off"}},{"ACTORGROUP":{}}]', 'toJSON: proof representation, after removing, before add virtual device')

})