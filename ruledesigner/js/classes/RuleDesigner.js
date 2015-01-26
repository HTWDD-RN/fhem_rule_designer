/**
 * Set global variables
 */

// structure of Array [element type, number of used arguments]
// "-1" stand for infinity
var _GatherList = [ [ "AND", -1 ], [ "OR", -1 ], [ "NOT", 1 ] ];

// a global counter for generating unique system id's - need for event
// communication between designer field and rules model objects
var cSYS_ID = new Counter()


/**
 * TODO
 */
var getDemoRules = function() {

	var rules = []

	keyBuilder = function(obj, rules) {

		for (key in obj) {
			if (!(obj[key] instanceof Rule) && Object.keys(obj[key])) {
				keyBuilder(obj[key], rules)
			} else {
				rules.push(obj[key])
			}
		}

	}
	keyBuilder(DEMO, rules)
	return rules
}

/**
 * Klasse RulesDesigner TODO: Singleton
 */
function __RuleDesigner() {

	/* BEGIN INITS */

	var _self = this

	Log('Ruledesigner.js - Create', '(main conroller)', 3)

	var stepsCounter = new Counter()

	// The view for user interaction
	var _view

	// Model 1: A wrapper is need to interact with the external home automation
	// server (import device data)
	var _wrapper

	// Model 2: Load rules manager
	var _rules = new Rules()

	/**
	 * This function used to initialize the wrapper Includes the call of
	 * cbBindWrapperData.
	 */
	var cbInitWrapper = function() {
		Log('# RuleDesigner.js # cbInitWrapper', 4)
		_wrapper.init(cbBindWrapperData)
		stepsCounter()
	}

	/**
	 * This function used to bind wrapper data
	 */
	var cbBindWrapperData = function() {
		Log('# RuleDesigner.js # cbBindWrapperData', 4)
		Log('SuccessCallback', 5)

		var tmp = _wrapper.getAvailableSegmentations.getVirtualDevices();
		if ($(tmp).length > 0) {
			$.map(_wrapper.getAvailableSegmentations.getVirtualDevices(),
					function(val) {
						val.TYPE = 'SYS_' + val.ID + '_' + val.NAME
						VIRTUAL_DEVICES.push(val);
					})
		}
		stepsCounter()

		_view.actualize();
		stepsCounter()
		Log('NUM OF INIT STEPS : ' + (stepsCounter() - 1))
	}

	/* END INITS */

	/* BEGIN SERVICES */

	/**
	 * Function to create a new rule and adding to the interface
	 * 
	 * @param SYS_ID
	 *            as Rule id [optional]
	 */
	this.addNewRule = function() {
		Log('# RuleDesigner.js # addNewRule', 4)
		var newRule = new Rule(
				(arguments.length > 0 ? arguments[0] : 'unknown'))
		if (_rules.addRule(newRule)) {
			return newRule
		}
		return null
	}

	/**
	 * This function return the rules, representing as root node
	 * 
	 * @return rules object {Rules.js}
	 */
	this.getRules = function() {
		return _rules.getRules();
	};

	/**
	 * @deprecated Function to commit the information about the available
	 *             gathers to the view
	 */
	this.getGatherList = function() {
		Log('# RuleDesigner.js # getGatherList', 4)
		return _GatherList;
	}

	/**
	 * Returns the item categorized by segmentation The available segmentations
	 * for a specific wrapper / Home Automation System can asked by calling
	 * _wrapper.getAvailableSegmentations
	 * 
	 * @param segmentation
	 * @returns JSON-object with object informations
	 */
	this.getItems = function(segmentation) {
		var func = '_wrapper.getAvailableSegmentations.' + segmentation + '()'
		return eval(func)
	}

	/**
	 * Return the available seqmentation of the loaded wrapper. This function
	 * used to allow filtering the draggable items
	 * 
	 * @return object of function
	 */
	this.getAvailableSegmentation = function() {
		if ((typeof _wrapper) === 'undefined')
			return {
				defaultFunc : 'getClassic'
			}
		return _wrapper.getAvailableSegmentations
	}
	
	/**
	 * Return the available seqmentation of the loaded wrapper. This function
	 * used to allow filtering the draggable items
	 * 
	 * @return object of function
	 */
	this.getObjectInfo = function() {
		var seg = _wrapper.getAvailableSegmentations

		return _wrapper.getAvailableSegmentations
	}

	/**
	 * Returns the initiated list of virtual devices. TODO: Replaced with an
	 * Hot-Plug-able function for actualization Now, the VirtualDevice's are
	 * parsed on load. The disadvantage of this method is that you must reload
	 * the pages if virtual devices added.
	 * 
	 * @return JSON-Object
	 */
	this.getVirtualDevices = function() {
		return VIRTUAL_DEVICES
	}

	/**
	 * Function to removes a rule object
	 */
	this.removeRule = function(SYS_ID) {
		Log('# RuleDesigner.js # deleteRule (SYS_ID: ' + SYS_ID + ')', 4)
		// TODO - Verknuepfungen in anderen Objekten loeschen
		if (_rules.removeRule(SYS_ID)) {
			_view.actualize(); // actualize view ...
			return true
		}
		return false
	};

	/**
	 * Adds ...
	 */
	this.addElement = function(rel, id, type) {

		var bool = true
		var source = null
		var target_resource = _rules.search(rel)

		// Ist Object eine Regel
		var obj = _rules.search(id)
		if(bool && obj !== undefined && obj instanceof Rule){
			// TODO - Regel to Actorside
			bool = false
		}
		
		if (bool && id == 'Actorsgroup') {
			source = new Actorgroup()
			if (target_resource.addAction(source))
				return target_resource.display()
		}
		
		if(bool){
		for (key in _GatherList){
			if(_GatherList[key][0] == id){
				obj = new Gather(id)
				bool = false
			}
		}
		}

		if(bool){ // Detect VirtualDevices
			if($(type).hasClass('drop-vdev') || $(type).hasClass('drop-vdev-cond') || $(type).hasClass('drop-vdev-actorgroup')){
				obj = new VirtualDevice(id)
				bool = false // Detect Condition
			} else if($(type).hasClass('drop-condition') || $(type).hasClass('drop-gather')){
				obj = new Condition(id)
				bool = false //Detect Actor
			} else if($(type).hasClass('drop-action') || $(type).hasClass('drop-actor')){
				obj = new Condition(id)
				bool = false
			}
		}

	//	Log(VIRTUAL_DEVICES)
		
	//	var info = this.getObjectInfo(id)
		Log(target_resource, source, 5)
		if (!bool && target_resource.addObject(obj))
			return target_resource.display()
		return null
	}

	/**
	 * This function is searching and removing rules or items from the model by
	 * an ID. In this system the ID is called SYS_ID.
	 * 
	 * @param SYS_ID
	 * @return boolean - true if removing successful
	 */
	this.removeElement = function(SYS_ID) {
		var obj = _rules.search(SYS_ID)
		if (obj != null) {
			obj.unset()
			delete obj // Use for deleting keys, global und local environment
			// vars
			if (obj != undefined) // Use for deleting vars from variable
				// environment
				obj = undefined
			return true
		}
		return false
	}
	
	/**
	 * 
	 */
	this.removeObject = function(SYS_ID){
		Log('RuleDesigner -', SYS_ID, 5)
		return _rules.removeObject(SYS_ID)
	}
	

	/**
	 * LoadRule TODO: implements interface
	 */
	this.loadRule = function() {
		alert("loadRule");
		return true; // TODO: false if fail
	};

	/**
	 * Save rule TODO: implements interface
	 */
	this.saveRule = function() {
		alert("saveRule");
		alert(this.generateJSONString);
		return true; // TODO: false if fail
	};

	/**
	 * SaveAs rule TODO: implements interface
	 */
	this.saveAsRule = function() {
		alert("saveAsRule");
		Log(this.generateJSONString);
		return true; // TODO: false if fail
	};

	/**
	 * Generates JSON-string information for displaying
	 * 
	 * @return JSON-string
	 */
	this.generateJSONString = function() {
		return _rules.serialize();
	};
	/* END SERVICES */

	// Initialize RuleDesigner
	var init = function() {
		Log('# RuleDesigner.js # Init-function', 4)

		// Step 1 - Load GUI-Ressource
		Helpers.loadGUIContainer(function() {
			stepsCounter()

			// Step 2 Initialize a new rule
//			_self.addNewRule()

			// Step [Optional] add demo rules
			if (Configuration.DEBUG_LEVEL >= 5 && typeof DEMO !== 'undefined'){
				var demorules = getDemoRules()
//				for(key in demorules){
//					_rules.addRule(demorules[key])
//				}
				_rules.addRule(demorules[7])
			}

				// Step 3 - Initialize/Build WildCard - GUI
			_view = new MainView(_self);
			stepsCounter()

			// Step 4 - LoadWrapper
			Helpers.loadWrapper(Configuration.WRAPPER, function() {
				_wrapper = new Wrapper();
				cbInitWrapper()

			})

		})
	}()

};
