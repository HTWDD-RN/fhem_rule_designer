/**
 * Function to initiate a rule object
 * 
 * @param id -
 *            itentifier
 * @param arg_0 -
 *            object of type VirtualDevice, Conditions, Actions or an array in
 *            structure of parameters ...
 * @param arg_n
 * @return rule object
 */
var Rule = function(id) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new RuleModel(_self, id)

	var _view = new RuleView(_self)

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions
//	var keys = Object.keys(_model)
//	for (var n = 0; n < keys.length; n++) {
//		eval('_self.' + keys[n] + ' = _model.' + keys[n])
//	}
	for (var key in _model){
		eval('_self.' + key + ' = _model.' + key)
	}


	if (arguments.length > 1) {
		if (arguments[1] === 'Params') {
			_model.getParams.setParameters(arguments[n])
		}
	}

}

var RuleModel = function(controller, id) {

	var _ID = id

	var _controller = controller

	var _params = new Params() // Array

	var _actions = new Actions() // Array

	var _conditions = null // Object

	var _virtual_device = null // Object

	/**
	 * Gets the ID object
	 * 
	 * @return object
	 */
	this.getID = function() {
		return _ID
	}

	/**
	 * Gets parameter object
	 * 
	 * @return object
	 */
	this.getParams = function() {
		return _params
	}

	/**
	 * Gets actions object
	 * 
	 * @return object
	 */
	this.getActions = function() {
		return _actions
	}

	/**
	 * Sets the conditions object
	 * 
	 * @param object
	 *            of types Condition or Gather
	 * @return boolean - true if success
	 */
	this.setConditionObj = function(obj) {
		if (obj instanceof Condition || obj instanceof Gather) {
			delete _conditions
			_conditions = obj
			return true
		}
		return false
	}

	/**
	 * Get the conditions object
	 * 
	 * @return object
	 */
	this.getConditionObj = function() {
		return _conditions
	}

	/**
	 * Remove conditions object
	 * 
	 * @return boolean - true if success
	 */
	this.removeConditionObj = function() {
		if (_condtions != null) {
			delete _conditions
			_conditions = null
			return true
		}
		return false
	}

	/**
	 * Sets the virtual device object
	 * 
	 * @param object of type VirtualDevice
	 * @return boolean - true if success
	 */
	this.setVirtualDevice = function(obj) {
		if (obj instanceof VirtualDevice){
			_virtual_device = obj
			return true
		}
		return false
	}

	/**
	 * Get the virtual device object
	 * 
	 * @return object
	 */
	this.getVirtualDevice = function() {
		return _virtual_device
	}

	/**
	 * Remove virtual device
	 * 
	 * @return boolean - true if success
	 */
	this.removeVirtualDevice = function() {
		if (_virtual_device != null) {
			delete _virtual_device
			_virtual_device = null
			return true
		}
		return false
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {

		var tmp = {}

		tmp["ID"] = (_ID !== undefined ? _ID:'')
		tmp["PARAMS"] = _params.toJSON()

		if (_conditions != null)
			tmp["COND"] = _conditions.toJSON()

		tmp["ACTIONS"] = _actions.toJSON()

		if (_virtual_device != null)
			tmp["VDEV"] = _virtual_device.toJSON()

		return tmp
	}

	/**
	 * Generates short of this object information
	 * 
	 * @return JSON-object
	 */
	this.getInfo = function() {
		var tmp = {
			"ID" : (_ID !== undefined ? _ID:''),
			"PARAMS" : _params.toJSON()
		}
		return tmp
	}
}

var RuleView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_model) {
		var condObj = _model.getConditions()
		var vdevObj = _model.getVirtualDeviceObject()
		var actionsObj = _model.getActions()

		var html = '<ul class="obj_rule">' + '<li>'
				+ (condObj != null ? condObj.display() : 'Placeholder')
				+ '</li>' + '<li class="vdev">'
				+ (vdevObj != null ? vdevObj.display() : 'VDEV') + '</li>'
				+ '<li>' + (actionsObj.display()) + '</li>' + '</ul>'
		return html
	}

}
