var Condition = function(id) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ConditionModel(_self, id)

	var _view = new ConditionView(_self)

	/**
	 * This function is looking for an device with SYS_ID
	 * @param SYS_ID - internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID){
		// Proof this object
		if (this.SYS_ID == SYS_ID) {
			return _self
		}
		
		// Proof VirtualDevice-object
		var obj =_model.getVirtualDevice()
		if(obj != null && obj.search(SYS_ID) != null){
				return obj
		}
		return null
	}
	
	/**
	 * Removes all recursive includes Elements
	 * @return bool - true, if successful
	 */
	this.removeElements = function(){
		return _model.unset()
	}
	
	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_events) {
		return _view.display(_model, _events)
	}
	

	/**
	 * Integrates a parameter directly, when not exists. It make a tunneling
	 * call to the addRefParam function of the including Params object
	 * 
	 * @param parameter
	 * @param operand
	 * @param value
	 * @param [optional 1]
	 * ...
	 * @param [optional n]
	 * @return boolean - true if success
	 */
	this.addRefParam = function(refParam, op, value) {
		var args = Array.prototype.slice.call(arguments)
		// mapping because the number of argumets is variable
		var cmd = '_model.getRefParamObj().addRefParam(refParam, op, value'
			for(var n = 3; n<args.length; n++){
				cmd += ', arguments['+n+']'
			}			
			cmd +=')'
		return eval(cmd)
	}
	
	/**
	 * Update a parameter, when exists. It make a tunneling
	 * call to the updateParam function of the including Params object
	 * 
	 * @param parameter
	 * @param operand
	 * @param value
	 * @param [optional 1]
	 * ...
	 * @param [optional n]	 * 
	 * @return boolean - true if success
	 */
	this.updateRefParam = function(refParam, op, value) {
		var args = Array.prototype.slice.call(arguments)
		// mapping because the number of argumets is variable
		var cmd = '_model.getRefParamObj().updateRefParam(refParam, op, value'
		for(var n = 3; n<args.length; n++){
			cmd += ', arguments['+n+']'
		}			
		cmd +=')'
		return eval(cmd)
	}

	/**
	 * Returns parameter as key/value-object. In difference to the local
	 * getParamObj function it make a tunneling call to the getParameter
	 * function of the including Params object
	 * 
	 * @return getRefParameter
	 */
	this.getRefParameter = function() {
		return _model.getRefParamObj().getRefParameter()
	}
	
	/**
	 * Returns the value of given RefParameter
	 * 
	 * @param string /
	 *            key
	 * @return parameter value
	 */
	this.getRefParamValue = function(refParam) {
		return _model.getRefParamObj().getRefParamValue(refParam)
	}
	
	/**
	 * Deletes an parameter if found. It make a tunneling call to the
	 * removeRefParam function of the including Params object
	 * 
	 * @param key /
	 *            parameter
	 * @return boolean - true if success
	 */
	this.removeRefParam = function(refParam) {
		return _model.getRefParamObj().removeRefParam(refParam)
	}

	/**
	 * This is a forcing set up of parameters - olds are deleting. It make a
	 * tunneling call to the setRefParameters function of the including Params
	 * object
	 * 
	 * @param -
	 *            Params object
	 * @return boolean - true if success
	 */
	this.setRefParameter = function(data) {
		return _model.getRefParamObj().setRefParameter(data)
	}

	// Bind model functions
//	var keys = Object.keys(_model)
//	for (var n = 0; n < keys.length; n++) {
//		eval('_self.' + keys[n] + ' = _model.' + keys[n])
//	}
	for (var key in _model){
		eval('_self.' + key + ' = _model.' + key)
	}

}
var ConditionModel = function(controller, id) {

	var _self = this

	var _id = id

	var _ref_params = new RefParams()

	var _virtual_device = null

	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		_virtual_device = null
		
		_ref_params = undefined
		if (_ref_params === undefined && _virtual_device == null) {
			_ref_params = new RefParams()
			return true
		}
		return false
	}
	
	/**
	 * Set a virtual device, e.g. Timer
	 * 
	 * @param object -
	 *            of Virtual device
	 * @return boolean - true if success
	 */
	this.setVirtualDevice = function(obj) {
		if (obj instanceof VirtualDevice && obj.getAsReference()) {
			_virtual_device = obj
			return true
		}
		return false
	}

	/**
	 * Removes virtual device
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
	 * Get virtual device object
	 * 
	 * @return device of type "VirtualDevice"
	 */
	this.getVirtualDevice = function() {
		return _virtual_device
	}
	/**
	 * Return ID
	 * 
	 * @return ID
	 */
	this.getID = function() {
		return _id
	}
	/**
	 * Return the parameter object of device.
	 * 
	 * @return parameter object
	 */
	this.getRefParamObj = function() {
		return _ref_params
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = {}
		var s = _ref_params.getRefParameter()
		if (s) {
			tmp['SENSOR'] = _id
			tmp['REF_PARAMS'] = _ref_params.toJSON()
			if (_virtual_device != null)
				tmp['VDEV'] = _virtual_device.toJSON()
		}
		return tmp
	}

}

var ConditionView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		return '' // TODO:
	}

}
