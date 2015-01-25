if (typeof DEMO === 'undefined') // Is another DEMO defined
	var DEMO = {}

	// Simulate ID-Generator
	// If the representation of all objects on the home
	// automation server without an ID an alternative
	// counter is use to generates ID
if (typeof cSYS_ID === 'undefined') {
	var cSYS_ID = function() {

		var count = new Counter()

		return function() {
			return Configuration.ID_PREFIX + count();
		}

	}()
}
DEMO.EXAMPLE1 = {}
DEMO.EXAMPLE1.A = function() {
	var rule = new Rule('RULE_1_LIGHT_ON')
	var rule_params = {
		'name' : 'Fernsteuerung Einschaltregel',
		'descr' : 'Einschaltregel zu Fernsteuerung des Lichtes'
	}

	rule.getParamObj().setParameter(rule_params)
	rule.getParamObj().addParam('link', 'Demo 1 - Regel 1')
	rule.getParamObj().addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.getParamObj().addParam('Beispiel', 1)

	var cond = new Condition('Schalter (S)')
	var ref_params = {
		'state' : [ '==', 'on' ]
	}
	cond.setRefParameter(ref_params)
	rule.setConditionObj(cond)

	var actor = new Actor('Lampe (L1)')
	var actor_params = {
		'state' : 'on'
	}
	actor.setParameter(actor_params)
	rule.getActions().addAction(actor)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE1.B = function() {
	/*
	 * 
	 */
	var rule = new Rule('RULE_1_LIGHT_OFF')
	var rule_params = {
		'name' : 'Fernsteuerung Ausschaltregel',
		'descr' : 'Ausschaltregel zu Fernsteuerung des Lichtes'
	}

	rule.getParamObj().setParameter(rule_params)
	rule.getParamObj().addParam('link', 'Demo 1 -Regel 2')
	rule.getParamObj().addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.getParamObj().addParam('Beispiel', 1)
	var cond = new Condition('Schalter (S)')
	var ref_params = {
		'state' : [ '!=', 'on' ]
	}
	cond.setRefParameter(ref_params)
	rule.setConditionObj(cond)

	var actor = new Actor('Lampe (L1)')
	var actor_params = {
		'state' : 'off'
	}
	actor.setParameter(actor_params)
	rule.getActions().addAction(actor)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE2 = {}

DEMO.EXAMPLE2.A = function() {
	var rule = new Rule('RULE_2_VAR_A')
	var rule_params = {
		'name' : 'Heizungssteuerung',
		'descr' : 'Regel zur Heizungssteuerung',
		'Bemerkung' : 'Variante 1 - Zeitbegrenzung als Bedingung interpretiert'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 2.1')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 2.1)

	var vdev = new VirtualDevice('TIMER')
	vdev.getParamObj().setParameter({
		'BeginTime' : 5,
		'EndTime' : 22
	})

	var sensor1 = new Condition('Thermometer (T)')
	sensor1.setRefParameter({
		'temperature' : [ '<', 20.5 ]
	})

	var sensor2 = new Condition('Heizung (H)')
	sensor2.setRefParameter({
		'state' : [ '=', 'off' ]
	})
	sensor2.setVirtualDevice(vdev)

	var actor = new Actor('Heizung (H)')
	actor.setParameter({
		'state' : 'on',
		'temperature' : 21.7
	})

	var gather = new Gather('AND')
	gather.addCondition(sensor1)
	gather.addCondition(sensor2)

	rule.setConditionObj(gather)
	rule.getActions().addAction(actor)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE2.B = function() {
	/*
	 * 
	 */
	var rule = new Rule('RULE_2_VAR_B')
	var rule_params = {
		'name' : 'Heizungssteuerung',
		'descr' : 'Regel zur Heizungssteuerung',
		'Bemerkung' : 'Variante 2 - Zeitbegrenzung als Ablehnungskriterium interpretiert'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 2.2')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 2.2)

	var vdev = new VirtualDevice('TIMER')
	vdev.getParamObj().setParameter({
		'BeginTime' : 5,
		'EndTime' : 22
	})

	var sensor1 = new Condition('Thermometer (T)')
	sensor1.setRefParameter({
		'temperature' : [ '<', 20.5 ]
	})

	var sensor2 = new Condition('Heizung (H)')
	sensor2.setRefParameter({
		'state' : [ '=', 'off' ]
	})

	var actor = new Actor('Heizung (H)')
	actor.setParameter({
		'state' : 'on',
		'temperature' : 21.7
	})

	var gather = new Gather('AND')
	gather.addCondition(sensor1)
	gather.addCondition(sensor2)

	rule.setConditionObj(gather)
	rule.getActions().addAction(actor)
	rule.setVirtualDevice(vdev)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE2.C = function() {

	/*
	 * 
	 */
	var rule = new Rule('RULE_2_VAR_C')
	var rule_params = {
		'name' : 'Heizungssteuerung',
		'descr' : 'Regel zur Heizungssteuerung',
		'Bemerkung' : 'Variante 3 - Zeitbegrenzung als Ausführungsbeschränkung interpretiert'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 2.3')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 2.3)

	var vdev = new VirtualDevice('TIMER')
	vdev.getParamObj().setParameter({
		'BeginTime' : 5,
		'EndTime' : 22
	})

	var sensor1 = new Condition('Thermometer (T)')
	sensor1.setRefParameter({
		'temperature' : [ '<', 20.5 ]
	})

	var sensor2 = new Condition('Heizung (H)')
	sensor2.setRefParameter({
		'state' : [ '=', 'off' ]
	})

	var actor = new Actor('Heizung (H)')
	actor.setParameter({
		'state' : 'on',
		'temperature' : 21.7
	})

	var agroup = new Actorgroup()
	agroup.setVirtualDevice(vdev)
	agroup.getActors().addActor(actor)

	var gather = new Gather('AND')
	gather.addCondition(sensor1)
	gather.addCondition(sensor2)

	rule.setConditionObj(gather)
	rule.getActions().addAction(agroup)
	return rule
}()

DEMO.EXAMPLE3 = function() {
	/*
	 * 
	 */
	var rule = new Rule('RULE_3')
	var rule_params = {
		'name' : 'Treppenhaus / Langer Gang',
		'descr' : 'Regel zur zeitverzögerten Fernsteuerung des Lichtes',
		'Bemerkung' : 'Unreales Beispiel - benötigt um die Möglichkeiten der Grammatik aufzuzeigen'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 3')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 3)

	var sensor1 = new Condition('Taster (S1)')
	sensor1.setRefParameter({
		'event' : [ '=', 'click' ]
	})

	var sensor2 = new Condition('Taster (S2)')
	sensor2.setRefParameter({
		'event' : [ '=', 'click' ]
	})

	var sensorX = new Condition('...')
	sensorX.setRefParameter({
		'event' : [ '=', 'click' ]
	})

	var sensorN = new Condition('Taster (SN)')
	sensorN.setRefParameter({
		'event' : [ '=', 'click' ]
	})

	var gather = new Gather('OR')
	gather.addCondition(sensor1)
	gather.addCondition(sensor2)
	gather.addCondition(sensorX)
	gather.addCondition(sensorN)

	var actor1 = new Actor('Lampe (L_1)')
	actor1.setParameter({
		'state' : 'on'
	})
	var actor2 = new Actor('Lampe (L_2)')
	actor2.setParameter({
		'state' : 'on'
	})
	var actorX = new Actor('...')
	actorX.setParameter({
		'state' : 'on'
	})
	var actorI = new Actor('Lampe (L_I)')
	actorI.setParameter({
		'state' : 'on'
	})

	var actorI1 = new Actor('Lampe (L_I1)')
	actorI1.setParameter({
		'state' : 'on'
	})
	var actorI2 = new Actor('Lampe (L_I2)')
	actorI2.setParameter({
		'state' : 'on'
	})
	var actorIX = new Actor('...')
	actorIX.setParameter({
		'state' : 'on'
	})
	var actorJ = new Actor('Lampe (L_J)')
	actorJ.setParameter({
		'state' : 'on'
	})

	var actorgroupJ = new Actorgroup()
	actorgroupJ.getActors().addActor(actorI1)
	actorgroupJ.getActors().addActor(actorI2)
	actorgroupJ.getActors().addActor(actorIX)
	actorgroupJ.getActors().addActor(actorJ)

	var vdevJ = new VirtualDevice('DELAY_TIMER')
	vdevJ.getParamObj().addParam('delay', '2000000') // 3min 20s
	actorgroupJ.setVirtualDevice(vdevJ)

	var actorJ1 = new Actor('Lampe (L_J1)')
	actorJ1.setParameter({
		'state' : 'on'
	})
	var actorJ2 = new Actor('Lampe (L_J2)')
	actorJ2.setParameter({
		'state' : 'on'
	})
	var actorJX = new Actor('...')
	actorJX.setParameter({
		'state' : 'on'
	})
	var actorN = new Actor('Lampe (L_N)')
	actorN.setParameter({
		'state' : 'on'
	})

	var actorgroupN = new Actorgroup()
	actorgroupN.getActors().addActor(actorJ1)
	actorgroupN.getActors().addActor(actorJ2)
	actorgroupN.getActors().addActor(actorJX)
	actorgroupN.getActors().addActor(actorN)

	var vdevN = new VirtualDevice('DELAY_TIMER')
	vdevN.getParamObj().addParam('delay', '4000000') // 6min 40s
	actorgroupN.setVirtualDevice(vdevN)

	rule.setConditionObj(gather)
	rule.getActions().addAction(actor1)
	rule.getActions().addAction(actor2)
	rule.getActions().addAction(actorX)
	rule.getActions().addAction(actorI)
	rule.getActions().addAction(actorgroupJ)
	rule.getActions().addAction(actorgroupN)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE4 = function() {

	/*
	 * 
	 */
	var rule = new Rule('RULE_4')
	var rule_params = {
		'name' : 'Produktionskette',
		'descr' : 'Regel zum Anfahren von Produktionsanlagen'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 4')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 4)

	var vdev = new VirtualDevice('ACTIVATION_TIMER')
	vdev.getParamObj().setParameter({
		'weekdays' : '37',
		'InitTime' : 20
	})
	rule.setVirtualDevice(vdev)

	var actorM1 = new Actor('Anlage (M1)')
	actorM1.setParameter({
		'state' : 'on'
	})
	var actorM2 = new Actor('Anlage (M2)')
	actorM2.setParameter({
		'state' : 'on'
	})
	var actorM3 = new Actor('Anlage (M3)')
	actorM3.setParameter({
		'state' : 'on'
	})
	var actorM4 = new Actor('Anlage (M4)')
	actorM4.setParameter({
		'state' : 'on'
	})

	var actorgroup1 = new Actorgroup()
	actorgroup1.getActors().addActor(actorM3)
	actorgroup1.getActors().addActor(actorM3)

	var vdev = new VirtualDevice('DELAY_TIMER')
	vdev.getParamObj().addParam('delay', '1200')
	actorgroup1.setVirtualDevice(vdev)

	var actorgroup2 = new Actorgroup()
	actorgroup2.getActors().addActor(actorM4)

	var vdev = new VirtualDevice('DELAY_TIMER')
	vdev.getParamObj().addParam('delay', '1200')
	actorgroup2.setVirtualDevice(vdev)

	rule.getActions().addAction(actorM1)
	rule.getActions().addAction(actorgroup1)
	rule.getActions().addAction(actorgroup2)

	return rule
}() // Execute the rule generation directly and store it after finishing

DEMO.EXAMPLE5 = function() {

	/*
	 * 
	 */
	var rule = new Rule('RULE_5')
	var rule_params = {
		'name' : 'Klimaanlage',
		'descr' : 'Regel zur Inbetriebnahme im Sommer'
	}

	rule.setParameter(rule_params)
	rule.addParam('link', 'Demo 5')
	rule.addParam('Kaptitel', 'X.3 Validierung und Anwendung')
	rule.addParam('Beispiel', 5)

	var sensor1 = new Condition('Temperatursensor, innen (S1)')
	sensor1.addRefParam('temperature', '>', 30)

	var sensor2 = new Condition('Hygrometer außen (S2)')
	sensor2.setRefParameter({
		'humidity' : [ '>', 80 ]
	})

	var gather = new Gather('OR')
	gather.addCondition(sensor1)
	gather.addCondition(sensor2)

	var vdev = new VirtualDevice('ACTIVATION_TIMER')
	vdev.getParamObj().setParameter({
		'weekdays' : '37',
		'InitTime' : 20
	})
	rule.setVirtualDevice(vdev)

	var actorA1 = new Actor('Fenster (A1)')
	actorA1.addParam('state', 'close')
	var actorA2 = new Actor('Fenster (A2)')
	actorA2.setParameter({
		'state' : 'close'
	})
	var actorA3 = new Actor('Klimaanlage (A3)')
	actorA3.getParamObj().setParameter({
		'state' : 'on',
		'temperature' : 20.5
	})

	rule.getActions().addAction(actorA1)
	rule.getActions().addAction(actorA2)
	rule.getActions().addAction(actorA3)

	return rule
}() // Execute the rule generation directly and store it after finishing
