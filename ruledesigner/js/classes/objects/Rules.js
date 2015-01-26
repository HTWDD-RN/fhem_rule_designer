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

	/**
	 * This function is looking for an device with SYS_ID
	 * 
	 * @param SYS_ID -
	 *            internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID) {
		var obj = null
		var rules = _model.getRules()
		for (var key in rules){
			obj = rules[key].search(SYS_ID)
			if(obj != null)
				break
		}
		return obj
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
	 * TODO
	 */
	this.removeObject = function(SYS_ID){
		Log('Rules -', SYS_ID, 5)
		for(var key in _rules){
			if(key == SYS_ID){
				_rules[key].unset()
				_rules[key] = undefined
				delete _rules[key]
				Log('Rule ' + key + ' removed.')
				return true
			} else {
				if(_rules[key].removeObject(SYS_ID)){
					return true
				}
			}
		}
		return false
	}	
	
	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		var bool = true 
		for(var key in _rules){
			if(!_rules[key].unset())
				bool=false
			delete _rules[key]
		}
		
		if(bool && Object.keys(_rules).length == 0)
			return true

		return false
	}
	
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
			_rules[SYS_ID.SYS_ID].unset()
			delete _rules[SYS_ID.SYS_ID]
			return true
		} else if (SYS_ID in _rules) {
			_rules[SYS_ID].unset()
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
