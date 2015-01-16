/**
 * The Rules class includes model and functions for creating, deleting and
 * central management of rules representation
 * 
 * @return singleton-object / instance
 */
function Rules() {

	var _self = this // Important to simulate a singleton

	var _instance

	var _model

	/**
	 * Return the JSON-Tree of all rules
	 * 
	 * @return cleand JSON objects
	 */
	this.serialize = function() {
		return  JSON.stringify(_model.toJSON(), null, 3)
	}

	return function() {
		if (_instance === undefined || _instance == null) {
			_instance = _self // not this!!! - it returns the rule designer
			_model = new RulesModel(_instance)

			// var keys = Object.keys(_model)
			// for (var n = 0; n < keys.length; n++) {
			// eval('_instance.' + keys[n] + ' = _model.' + keys[n])
			// }
			for ( var key in _model) {
				eval('_instance.' + key + ' = _model.' + key)
			}
		}
		return _instance
	}()

}

function RulesModel(controller, id) {

	var _self = this

	var _controller = controller
	
	var _ID = id

	var _rules = {}

	/**
	 * Function to add a rule
	 * 
	 * @param object
	 *            of type rule
	 * @return boolean - true if success
	 */
	this.addRule = function(rule) {
		if (rule instanceof Rule) {
			_rules[rule.SYS_ID] = rule
			return true
		}
		return false
	}

	/**
	 * Function to add a rule
	 * 
	 * @param object
	 *            of type rule
	 * @return boolean - true if success
	 */
	this.removeRule = function(SYS_ID) {
		if ((SYS_ID instanceof Rule) && SYS_ID.SYS_ID in _rules) {
			delete _rules[SYS_ID.SYS_ID]
			return true
		} else if (SYS_ID in _rules) {
			delete _rules[SYS_ID]
			return true
		}
		return false

	}

	/**
	 * Return array of Rule objects
	 */
	this.getRules = function() {
		return _rules
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = []

		for (var key in _rules){
			tmp.push(_rules[key].toJSON())
		}

		return tmp
	}

	/**
	 * Generates a short information of all rules
	 * 
	 * @return JSON-array
	 */
	this.getInfo = function() {
		var tmp = {}
		for (var key in _rules){
			var info = _rules[key].getInfo()
			tmp[info.ID] = info
		}
		return tmp
	}

}
