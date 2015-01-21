/**
 * Set global variables
 */

// structure of Array [element type, number of used arguments]
// "-1" stand for infinity
var _GatherList = [ [ "AND", -1 ], [ "OR", -1 ], [ "NOT", 1 ] ];

// a global counter for generating unique system id's - need for event
// communication between designer field and rules model objects
var cSYS_ID = new Counter()

// console.log(Counter1())

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

		var tmp = _wrapper.getAvailableSegmations.getVirtualDevices();
		if ($(tmp).length > 0) {
			$.map(_wrapper.getAvailableSegmations.getVirtualDevices(),
					function(val) {
						val.TYPE = 'SYS_' + val.ID + '_' + val.NAME
						VIRTUAL_DEVICES.push(val);
					})
		}
		stepsCounter()
		
		_view.actualizeObjectList(_wrapper.getAvailableSegmations,
				VIRTUAL_DEVICES)
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
	 * Function to removes a rule object
	 */
	this.removeRule = function(SYS_ID) {
		Log('# RuleDesigner.js # deleteRule (SYS_ID: ' + SYS_ID + ')', 4)
		// TODO - Verknuepfungen in anderen Objekten loeschen
		if(_rules.removeRule(SYS_ID)){
				_view.actualize(); // actualize view ...
				return true
		}
		return false
	};
	
	/**
	 * 
	 */
	this.removeElement = function(){
		var obj = rules.search(SYS_ID)
		if (obj != null){
			obj.unset()
			delete obj // Use for deleting keys, global und local environment vars
			if(obj != undefined) // Use for deleting vars from variable environment
				obj = undefined
			return true
		}
		return false
	}

	/**
	 * @deprecated Function to commit the information about the available
	 *             gathers to the view
	 */
	this.getGatherList = function() {
		Log('# RuleDesigner.js # getGatherList', 4)
		return _GatherList;
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
			_self.addNewRule()

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
