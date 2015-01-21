QUnit.test("Test Rules-object (js/classes/objects/Rules.js)", function(assert) {
	// Create instance of object which is testing

	var obj = new Rules()

	// First test instanciation
	assert.ok(obj instanceof Rules, "Instantiation");

	// Test Methods
	var params = {
		'NAME' : 'Fernsteuerung',
		'DESCR' : 'Diese ist eine zu Testzwecken erstellte Regel'
	}
	
	var rule = []
	rule.push(new Rule('Rule1'))
	rule.push(new Rule('Rule2'))
	rule.push(new Rule('Rule3'))
	rule.push(new Rule('Rule4'))
	
	// Test add rules
	for(var n=0; n<rule.length; n++){
		var params = {
				'NAME' : 'Fernsteuerung ('+n+')',
				'DESCR' : 'Diese ist eine zu Testzwecken erstellte Regel ('+n+')'
			}
		
		assert.ok(obj.addRule(rule[n]),'addRule: '+ (n+1))
		rule[n].getParamObj().setParameter(params)
	}

	// Test serialize
	assert.equal(JSON.stringify(JSON.parse(obj.serialize())), '[{"ID":"Rule1","PARAMS":{"NAME":"Fernsteuerung (0)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (0)"},"ACTIONS":[]},{"ID":"Rule2","PARAMS":{"NAME":"Fernsteuerung (1)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (1)"},"ACTIONS":[]},{"ID":"Rule3","PARAMS":{"NAME":"Fernsteuerung (2)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (2)"},"ACTIONS":[]},{"ID":"Rule4","PARAMS":{"NAME":"Fernsteuerung (3)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (3)"},"ACTIONS":[]}]', 'serialize: after add four rules')

	// Test remove rule
	assert.ok(obj.removeRule(rule[1].SYS_ID), 'removeRule: 2 by ID')
	assert.ok(obj.removeRule(rule[2]), 'removeRule: 3 by Object')

	// Test toJSON
	assert.equal(JSON.stringify(obj.toJSON()), '[{"ID":"Rule1","PARAMS":{"NAME":"Fernsteuerung (0)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (0)"},"ACTIONS":[]},{"ID":"Rule4","PARAMS":{"NAME":"Fernsteuerung (3)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (3)"},"ACTIONS":[]}]', 'toJSON: test after remove rules 2+3')

	// Test getInfo
	assert.equal(JSON.stringify(obj.getInfo()), '{"Rule1":{"ID":"Rule1","PARAMS":{"NAME":"Fernsteuerung (0)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (0)"}},"Rule4":{"ID":"Rule4","PARAMS":{"NAME":"Fernsteuerung (3)","DESCR":"Diese ist eine zu Testzwecken erstellte Regel (3)"}}}', 'toJSON: test after remove rules 2+3')

	// Test unset
	assert.ok(obj.unset())
	assert.equal(JSON.stringify(obj.toJSON()), '[]', 'toJSON: function')
})