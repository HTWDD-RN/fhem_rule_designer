QUnit.test( "Test Rule-object (js/classes/objects/Rule.js)", function( assert ) {
	// Create instance of object which is testing
	var obj = new Rule()
	
	// First test instantiation
	assert.ok( obj instanceof Rule, "Instantiation" );
	
	// Second test instantiation of auto-properties
	var actorsObj = obj.getActions()
	assert.ok((typeof actorsObj !== undefined && actorsObj instanceof Actions), "Actors object correct instanciated.")
	
	var params = { 'NAME' : 'Fernsteuerung', 'DESCR': 'Diese ist eine zu Testzwecken erstellte Regel' }
	
	// Third test instantiation of helpers
	
	var andGather = new Gather('AND')
	assert.ok( andGather instanceof Gather, "Instantiation Gather" )
	assert.equal( andGather.getLogical(), 'AND', "AND-Gather - TYPE validation" )
	
	var orGather = new Gather('OR')
	assert.ok( orGather instanceof Gather, "Instantiation Gather" )
	assert.equal( orGather.getLogical(), 'OR', "OR-Gather - TYPE validation" )
	
	var cond1 = new Condition('T1')
	assert.ok( cond1 instanceof Condition, "Instantiation Condition1" )
	assert.equal( cond1.getID(), 'T1', "Condition1 - ID validation" )	
	assert.ok(cond1.getRefParamObj().addRefParam('humidty', '>', 95), 'addRefParam: humidty')
	assert.ok(cond1.getRefParamObj().addRefParam('temperature_indoor', '<', 20), 'addRefParam: temperature indoor')
	
	var cond2 = new Condition('T1')
	assert.ok( cond2 instanceof Condition, "Instantiation Condition2" )
	assert.equal( cond2.getID(), 'T1', "Condition2 - ID validation" )
	assert.ok(cond2.getRefParamObj().addRefParam('temperature_outdoor', '<', 3), 'addRefParam: state')
	
	var cond3 = new Condition('R1')
	assert.ok( cond3 instanceof Condition, "Instantiation Condition3" )
	assert.equal( cond3.getID(), 'R1', "Condition3 - ID validation" )
	assert.ok(cond3.getRefParamObj().addRefParam('state', 'eq', 'home'), 'addRefParam: state')
	
	var vdev = new VirtualDevice( 'VD_DIGITAL_TIMER' )
	assert.ok( vdev instanceof VirtualDevice, "Instantiation VitualDevice" );
	assert.equal( vdev.getID(), 'VD_DIGITAL_TIMER', "VitualDevice - ID validation" );
	
	var actor1 = new Actor('H1')
	assert.ok( actor1 instanceof Actor, "Instantiation Actor1" );
	assert.equal( actor1.getID(), 'H1', "Actor1 - ID validation" );
	assert.ok(actor1.getParamObj().addParam('state', 'on'), 'addParam: state')
	assert.ok(actor1.getParamObj().addParam('temp', 20.5), 'addParam: temp')
	
	var actor2 = new Actor('H2')
	assert.ok( actor2 instanceof Actor, "Instantiation Actor2" );
	assert.equal( actor2.getID(), 'H2', "Actor2 - ID validation" );
	assert.ok(actor2.getParamObj().addParam('state', 'on'), 'addParam: state')
	assert.ok(actor2.getParamObj().addParam('temperature', 15.5), 'addParam: temperature')
	
	var actor3 = new Actor('L1')
	assert.ok( actor3 instanceof Actor, "Instantiation Actor1" );
	assert.equal( actor3.getID(), 'L1', "Actor3 - ID validation" );
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
	
	// Test Methods
	
	var tmp
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"ACTIONS":[]}', 'toJSON: proof representation')
	
	// Add condion1
	assert.ok(obj.setConditionObj(cond1), 'setConditionObj: add Condition1 to Rule')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},"ACTIONS":[]}', 'toJSON: proof representation')
	
	// Add gather OR, followed by condition2
	tmp = obj.getConditionObj()
	assert.strictEqual(tmp, cond1, 'getConditionObj: compareObjetcs')
	assert.ok(orGather.addCondition(tmp), 'addConditions: add temporary object')
	assert.ok(obj.setConditionObj(orGather), 'setConditionsObj: add OR-Gather')
	assert.ok(orGather.addCondition(cond2), 'addConditions: add temporary object')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},"ACTIONS":[]}', 'toJSON: proof representation')
	
	// Add gather TEST, followed by condition3
	tmp = obj.getConditionObj()
	assert.strictEqual(tmp, orGather, 'getConditionObj: compareObjetcs')
	assert.ok(andGather.addCondition(tmp), 'addConditions: add temporary object')
	assert.ok(obj.setConditionObj(andGather), 'setConditionsObj: add OR-Gather')
	assert.ok(andGather.addCondition(cond3), 'addConditions: add temporary object')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[]}', 'toJSON: proof representation')
	
	
	// Add actor1
	assert.ok(obj.getActions().addAction(actor1),'addActor: actor1')
	
	// Add actorgroup
	assert.ok(obj.getActions().addAction(actorgroup),'addActor: actorgroup')
	
	// Add actor2
	assert.ok(obj.getActions().addAction(actor2),'addActor: actor1')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}},{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}}]}', 'toJSON: proof representation')

	// Remove actor1 by ID
	assert.ok(obj.getActions().removeAction(actor1.SYS_ID),'removeActor: actor1')
	assert.equal(obj.getActions().removeAction(actor1.SYS_ID), false ,'removeActor: actor1 fail')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTORGROUP":{}},{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}}]}', 'toJSON: proof representation')

	// Remove actorgroup by ID
	assert.ok(obj.getActions().removeAction(actorgroup.SYS_ID),'removeActor: actorgroup')
	assert.equal(obj.getActions().removeAction(actorgroup.SYS_ID), false,'removeActor: actorgroup fail')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}}]}', 'toJSON: proof representation')

	// Restore actor1 && actorgroup
	assert.ok(obj.getActions().addAction(actor1),'addActor: actor1')
	assert.ok(obj.getActions().addAction(actorgroup),'addActor: actorgroup')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}]}', 'toJSON: proof representation')
	
	// Remove actor by comparing the objects
	assert.ok(obj.getActions().removeAction(actor1),'removeActor: actor1')
	assert.equal(obj.getActions().removeAction(actor1), false ,'removeActor: actor1 fail')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTORGROUP":{}}]}', 'toJSON: proof representation')

	// Remove actor by comparing the objects
	assert.ok(obj.getActions().removeAction(actorgroup),'removeActor: actorgroup')
	assert.equal(obj.getActions().removeAction(actorgroup), false,'removeActor: actorgroup fail')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}}]}', 'toJSON: proof representation')

	// Restore actor1 && actorgroup
	assert.ok(obj.getActions().addAction(actor1),'addActor: actor1')
	assert.ok(obj.getActions().addAction(actorgroup),'addActor: actorgroup')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}]}', 'toJSON: proof representation')

	// Add virtual device
	assert.ok(obj.setVirtualDevice(vdev), 'setVirtualDeviceObject')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}],"VDEV":{"TYPE":"VD_DIGITAL_TIMER","PARAMS":{}}}', 'toJSON: proof representation')


	// Test search function		
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.strictEqual(obj.search(vdev.SYS_ID), vdev, 'search: Test find VirtualDevice')
	assert.strictEqual(obj.search(actor1.SYS_ID), actor1, 'search: Test find Actor')
	assert.strictEqual(obj.search(orGather.SYS_ID), orGather, 'search: Test find Condition')

	// Get virtual device
	assert.deepEqual(obj.getVirtualDevice(), vdev, 'getVirtualDeviceObject: comparing objects')
	
	// Remove virtual device
	assert.ok(obj.removeVirtualDevice(), 'removeVirtualDeviceObject')
	assert.equal(obj.removeVirtualDevice(), false, 'removeVirtualDeviceObject')
	
	assert.equal(obj.getVirtualDevice(), null, 'getVirtualDeviceObject: null')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}]}', 'toJSON: proof representation')

	// Setup rule parameter
	assert.ok(obj.getParamObj().setParameter(params), 'setParameter: adds rule parameter')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{"NAME":"Fernsteuerung","DESCR":"Diese ist eine zu Testzwecken erstellte Regel"},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}]}', 'toJSON: proof representation')

	// Test information
	assert.equal(JSON.stringify(obj.getInfo()),'{"ID":"","PARAMS":{"NAME":"Fernsteuerung","DESCR":"Diese ist eine zu Testzwecken erstellte Regel"}}','getInfo: print short information')

	// Test Param object tunneling
	assert.ok(obj.updateParam('NAME', 'Rule_2'),'updateParam: NAME')
	assert.ok(obj.getParameter(),'getParameter')
	assert.ok(obj.addParam('Test', 'Rule_1'),'addParam: Test')
	assert.equal(obj.getParamValue('NAME'), 'Rule_2','getParamValue')
	assert.ok(obj.removeParam('NAME'),'removeParam: NAME')
	assert.equal(obj.removeParam('NAME'),false,'removeParam: fail NAME')
	assert.ok(obj.setParameter(JSON.parse(JSON.stringify(params))),'setparameter')
	
	var SYS_ID = obj.SYS_ID
	assert.strictEqual(obj.search(SYS_ID), obj, 'search: Test own ID')
	assert.equal(JSON.stringify(obj.toJSON()),'{"ID":"","PARAMS":{"DESCR":"Diese ist eine zu Testzwecken erstellte Regel","Test":"Rule_1"},"COND":{"AND":[{"OR":[{"SENSOR":"T1","REF_PARAMS":{"humidty":[">",95],"temperature_indoor":["<",20]}},{"SENSOR":"T1","REF_PARAMS":{"temperature_outdoor":["<",3]}}]},{"SENSOR":"R1","REF_PARAMS":{"state":["eq","home"]}}]},"ACTIONS":[{"ACTOR":"H2","PARAMS":{"state":"on","temperature":15.5}},{"ACTOR":"H1","PARAMS":{"state":"on","temp":20.5}},{"ACTORGROUP":{}}]}','getInfo: print short information')

	// Test unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '{"ID":"","PARAMS":{},"COND":{},"ACTIONS":[]}', 'toJSON: function')
})

