/**
 * Function to initiate a rule object
 * @param id - itentifier
 * @param arg_0 - object of type VirtualDevice, Conditions, Actions or an array in structure of parameters
 * ...
 * @param arg_n
 * @return rule object 
 **/
var Rule = function(id) {

	var _self = this

	var _model = new RuleModel(_self, id)

	var _view = new RuleView(_self)

	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){	
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
	
	if(arguments.length > 0){
		for(var n=0; n<arguments.length; n++){
			var type = typeof arguments[n]
		if(type === 'VirtualDevice'){  // for import configurations of virtual devices
			_model.setVirtualDeviceObject(arguments[n])
		} else if(type === 'Conditions') {// for import configurations of conditions
			_model.setConditions(arguments[n])
		} else if(type === 'Actions')  {// for import configuration of actions
			_model.setActons(arguments[n])
		} else if(type === 'Params' ) {
			_model.getParams.setParameters(arguments[n])
		} 
	}}
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
	this.getID = function(obj) {
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
	 * Sets actions object
	 * 
	 * @return object
	 */
	this.setActions = function(_obj) {
		_actions = _obj
	}
	/**
	 * Sets the conditions object
	 * 
	 * @param
	 */
	this.setConditions = function(obj) {
		_conditions = obj
	}

	/**
	 * Get the conditions object
	 * 
	 * @return
	 */
	this.getConditions = function() {
		return _conditions
	}

	/**
	 * Remove conditions object
	 */
	this.removeConditions = function() {
		delete _conditions
		_conditions = null
	}

	/**
	 * Sets the virtual device object
	 * 
	 * @param
	 */
	this.setVirtualDeviceObject = function(obj) {
		_virtual_device = obj
	}

	/**
	 * Get the virtual device object
	 * 
	 * @return
	 */
	this.getVirtualDeviceObject = function() {
		return _virtual_device
	}

	/**
	 * Remove virtual device
	 */
	this.removeVirtualObject = function() {
		delete _virtual_device
		_virtual_device = null
	}

	/**
	 * Build JSON tree
	 * 
	 * @return JSON object
	 */
	this.toJSON = function() {

		var tmp = {}

		tmp["ID"] = _ID
		tmp["PARAMS"] = _params.toJSON()

		if (_conditions != null)
			tmp["COND"] = _conditions.toJSON()

		tmp["ACTIONS"] = _actions.toJSON()

		if (_virtual_device != null)
			tmp["VDEV"] = _virtual_device.toJSON()

		return tmp
	}
	

	/**
	 * Build Info tree
	 * 
	 * @return Info object
	 */
	this.getInfo = function() {
		var tmp = { "ID" : _ID, "PARAMS":_params.toJSON() }
		return tmp
	}
}

var RuleView = function(controller) {
	
	var _self = this

	var _controller = controller
	
	this.display = function(_model){
		var condObj = _model.getConditions()
		var vdevObj = _model.getVirtualDeviceObject()
		var actionsObj = _model.getActions()

		var html = '<ul class="obj_rule">'
			+ '<li>' + (condObj != null ? condObj.display():'Placeholder') + '</li>'
			+ '<li class="vdev">' + (vdevObj != null ? vdevObj.display():'VDEV') + '</li>'
			+ '<li>' + (actionsObj.display()) + '</li>'
			+ '</ul>'
		return html
	}
	
}
