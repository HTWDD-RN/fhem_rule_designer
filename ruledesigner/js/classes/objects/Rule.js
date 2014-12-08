var Rule = function(id) {

	var _self = this

	var _model = new RuleModel(_self, id)

	var _view = new RuleView(_self)

	this.display = function() {
		return _view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
		
	this.getInfo = function(){
		return _model.toInfo()
	}

}

var RuleModel = function(controller, id) {

	var _ID = id

	var _params = new Params()

	var _actions = new Actions()

	var _conditions = new Conditions()

	var _virtual_device = new VirtualDevice()

	/**
	 * Gets the ID object
	 * 
	 * @return object
	 */
	this.getID = function(obj) {
		return _ID
	}

	/**
	 * Sets the actions object
	 * 
	 * @param object
	 */
	this.setActions = function(obj) {
		_actions = obj
	}

	/**
	 * Gets the actions object
	 * 
	 * @return object
	 */
	this.getActions = function() {
		return _actions
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
		var tmp_actions = _actions.toJSON()

		if (tmp_actions == null)
			throw "JSONBuildObjectException"

		var tmp_conditions = _conditions.toJSON()
		var tmp_virtual_device = _virtual_device.toJSON()

		if (tmp_conditions == null && tmp_virtual_device == null)
			throw "JSONBuildObjectException"

		var tmp = {}

		tmp["ID"] = _id
		tmp["PARAMS"] = _params.toJSON()

		if (tmp_conditions != null)
			tmp["COND"] = tmp_conditions.toJSON()

		tmp["ACTIONS"] = tmp_actions.toJSON()

		if (tmp_virtual_device != null)
			tmp["VDEV"] = tmp_virtual_device.toJSON()

		return tmp
	}
	

	/**
	 * Build Info tree
	 * 
	 * @return Info object
	 */
	this.toInfo = function() {
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
			+ '<li>' + (condObj.display()) + '</li>'
			+ '<li>' + (vdevObj.display()) + '</li>'
			+ '<li>' + (actionsObj.display()) + '</li>'
			+ '</ul>'
		return html
	}
}
