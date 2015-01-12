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

	// Model 2: Store rule data
	var _rules = new Rules()

	var cbInitWrapper = function() {
		Log('# RuleDesigner.js # cbInitWrapper', 4)
		_wrapper.init(cbBindWrapperData)
	}

	var cbBindWrapperData = function() {
		Log('# RuleDesigner.js # cbBindWrapperData', 4)
		Log('SuccessCallback', 5)

		var tmp = _wrapper.getAvailableSegmations.getVirtualDevices();
		if ($(tmp).lenght > 0) {
			$.map(_wrapper.getAvailableSegmations.getVirtualDevices(),
					function(val) {
						VIRTUAL_DEVICES['SYS_' + val.TYPE](val)
					})
		}
		_view.actualizeObjectList(_wrapper.getAvailableSegmations,
				VIRTUAL_DEVICES)
		_self.addNewRule()
	}

	// Step 1 - Load GUI-Ressource
	Helpers.loadGUIContainer(function() {
		stepsCounter()

		// Step 2 - Initialize/Build WildCard - GUI
		_view = new MainView(_self);
		stepsCounter()

		// Step 3 - LoadWrapper
		Helpers.loadWrapper(Configuration.WRAPPER, function() {
			_wrapper = new Wrapper();
			cbInitWrapper()
		})

		// Step 4 - Initialize other windows

		// Step 5 - Resize window
		$(window).resize();
		stepsCounter()
	})

	this.init = function(data) {
		Log('# RuleDesigner.js # Init-function', 4)
		_view.actualize();
		$(window).resize();
	};

	/* END INITS */

	/* BEGIN SERVICES */

	/**
	 * Function to create a new rule
	 */
	this.addNewRule = function() {
		Log('# RuleDesigner.js # addNewRule', 4)
		var newRule = _rules.createRule()
		_view.addRuleTab(newRule);
		// _view.actualize();
	}

	/**
	 * This function return the rules, representing as root node
	 * 
	 * @return rules object {Rules.js}
	 */
	this.getRules = function() {
		return _rules;
	};

	/**
	 * Function to removes a rule object
	 */
	this.deleteRule = function(SYS_ID) {
		Log('# RuleDesigner.js # deleteRule (SYS_ID: ' + SYS_ID + ')', 4)
		// TODO - Verknuepfungen in anderen Objekten loeschen
		for (n = 0; n < rules; n++) { // search rule with ...
			if (rules[n].ID == SYS_ID) { // ... SYS_ID
				delete rules[n] // if found delete rule object, ...
				view.actualize(); // actualize view ...
				return // and break function up
			}
		}
	};

	/**
	 * @deprecated Function to commit the information about the available
	 *             gathers to the view
	 */
	this.getGatherList = function() {
		Log('# RuleDesigner.js # getGatherList', 4)
		return _GatherList;
	}

	/* END SERVICES */

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
		return JSON.stringify(_rules.serialize(), null, 3);
	};

};
