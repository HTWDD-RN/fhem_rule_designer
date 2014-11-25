/**
 * Set global variables
 **/

// structure of Array [element type, number of used arguments]
// "-1" stand for infinity
var _GatherList = [ ["AND", -1], ["OR", -1] , ["NOT", 1] ];

/**
 * Re-built start symbol
 **/
// node <rules>
var Root = function(){
	
	var rules = []
	
	this.Add = function (rule_obj) {
		
	}
	
	this.Remove = function (id){
		
	}
};

/**
 * AbstractRuleObject
 */
function Device(_UNIQUE_ID) {

	console.log('Call CONSTRUCTOR of Devices');

	this._UNIQUE_ID = _UNIQUE_ID;

	this.Properties = new Object();

	this.readable = false;

	this.writeable = false;

	this.virtual = false;

};

Device.prototype = {
	display : function() {
		console.log('Call AbstractDevice.display');
		throw new NotImplementedException;
	}
};

/**
 * Klasse RulesDesigner TODO: Singleton
 */
function __RuleDesigner() {
	
	var _devices;	
	var sensors = [];
	var actors = [];
	var vdevs = [];

	var _count = Helpers.counter();
	
	
	this.getDevicesByType = function () {
		return {"sensors": sensors, "actors": actors, "virtual_algorythms": vdevs, "gather": _GatherList}
	}

	// BEGIN
	this.getNewRule = function() {

		/**
		 * Interne Klasse Rule
		 */
		function Rule(arguments) {

			var _UNIQUE_ID = 'RULE' + _count();

			this.Name = '[' + _UNIQUE_ID + ']';

			this.Descr = null;

			if (arguments[0] != null) {
				this.Name = arguments[0];
				if (arguments[1] != null)
					this.Descr = arguments[1];
			} else {
				this.Name = '[' + _UNIQUE_ID + ']';
			}

			this.getUID = function() {
				return _UNIQUE_ID;
			};
		};

		return new Rule(arguments);
	};
	// END

	var view = new RuleDesignerView(this);

	this.init = function(data) {
		console.log(data)
		$.each(data.Results, function(index, obj){
			if(obj.Attributes !== undefined && obj.Attributes.room !== undefined){
				if(obj.Readings !== undefined && Object.keys(obj.Readings).length)				
					sensors.push(obj);
				if(obj.PossibleSets !== undefined && obj.PossibleSets != "")
					actors.push(obj);
			} else {
				vdevs.push(obj);
			}
		});
		console.log("Initialisiere RulesDesigner");
		view.actualize();
		$(window).resize();
	};


	this.getDevices = function() {
//		return Devices;
	};

	this.getRules = function() {
//		return RuleObject;
	};

	/**
	 * NewRule
	 * 
	 */
	this.newRule = function(_name, _descr) {
		console.log('Create new rule');
		var tmpRule = this.getNewRule();
		eval('RuleObject.' + tmpRule.getUID() + '= tmpRule');
		view.addRuleTab(tmpRule);
		// console.log('Re-Initialize Rule-Designer');
		view.actualize();

		return true; // TODO: false if fail (the operation is break up over a
		// dialog)
	};

	this.deleteRule = function(_UNIQUE_ID) {
		// TODO - Verknuepfungen in anderen Objekten loeschen
		eval('delete RuleObject.' + _UNIQUE_ID);
		view.actualize();
	};

	/**
	 * LoadRule
	 * 
	 */
	this.loadRule = function() {
		alert("loadRule");
		return true; // TODO: false if fail
	};

	/**
	 * Save rule
	 * 
	 */
	this.saveRule = function() {
		alert("saveRule");
		alert(JSON.stringify(RuleObject));
		return true; // TODO: false if fail
	};

	/**
	 * SaveAs rule
	 * 
	 */
	this.saveAsRule = function() {
		alert("saveAsRule");
		console.log(JSON.stringify(RuleObject));
		return true; // TODO: false if fail
	};

	this.generateJSONString = function() {
		return JSON.stringify(RuleObject, null, 3);
	};

//	this.doEventAction = function(_task, _objInfo, _eventInfo) {
//
//		console.log('xdoEventAction Method: ' + _task);
//		console.log($(_eventInfo.target).hasClass('connector-right'));
//		console.log($(_eventInfo.target).hasClass('connector-left'));
//
//		var task = _task.split('.', 2);
//
//		if (task[0] === undefined || task[0] == null || task[1] == undefined
//				|| task[1] == null)
//			return;
//
//		switch (task[0]) {
//		case 'drop':
//			if (doDropEvents(task[1], _objInfo, _eventInfo))
//				view.actualize();
//			break;
//		}
//		;
//	};
//
//	var doDropEvents = function(_task, _objInfo, _eventInfo) {
//		var task = new Object();
//		task.method = _task.split('.', 2);
//		task.source = _objInfo.attr('rel');
//
//		var log = $(_eventInfo.target).parent('div').attr('rel');
//		if ($(_eventInfo.target).attr('rel') !== undefined)
//			task.target = $(_eventInfo.target).attr('rel').split('.');
//
//		switch (task.method[0]) {
//		case 'ruleTarget':
//			var Rule = eval('RuleObject.' + task.target[0]);
//			if (Rule === undefined)
//				return false; // Break up if match, whom circle injection
//
//			if (eval('Devices.' + task.source) !== undefined) {
//				eval('var _data = Devices.' + task.source);
//				var _obj = Object.clone(_data);
//				console.log(_obj);
//				var target = task.target[1];
//				if ( (eval('/'+Vars.rel_sensorlist_prefix+'([0-9])*/')).test(target) )
//					return Rule.getSensorList().addObject(_obj, task.target);
//				
//				if ( (eval('/'+Vars.rel_actorlist_prefix+'([0-9])*/')).test(target) )
//					return Rule.getActorList().addObject(_obj, task.target);
//				
//			} else if (eval('RuleObject.' + task.source) !== undefined) { //
//				eval('var _data = RuleObject.' + task.source);
//				var _obj = Object.clone(_data);
//				console.log(_obj);
//
//				if( task.target[1] == 'actor' )
//					return Rule.getActorList().addObject(_obj, task.target);
//			}
//			break;
//
//		case 'trash':
//			if (_objInfo._DEVICE_ID !== undefined) { // Is a device or a device similar object
//				if (eval('RuleObject.SensorList.' + _objInfo_DEVICE_ID) !== undefined) // Is in ActorList
//					return eval('RuleObject.Sensorlist.deleteObject('
//							+ _objInfo.DEVICE_ID + ')');
//
//				if (eval('RuleObject.ActorList.' + _objInfo_DEVICE_ID) !== undefined) // Is in Sensorlist
//					return eval('RuleObject.Actorlist.deleteObject('
//							+ _objInfo.DEVICE_ID + ')');
//			}
//
//			if (eval('RuleObject.' + _objInfo._RULE_ID) !== undefined) { // Is rule
//				eval('delete RuleObject.' + _objInfo._RULE_ID);
//				return true;
//			}
//			return false;
//			break;
//		default:
//			return false;
//		}
//		;
//	};


	
	
	Helpers.LoadAjax(this.init);
};
