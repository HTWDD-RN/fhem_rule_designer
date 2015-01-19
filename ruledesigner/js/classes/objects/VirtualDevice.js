var VirtualDevice = function(type) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var asReference = false
	if (typeof arguments[1] !== 'undefined')
		asReference = arguments[1] // If flag set the object is handeled as
									// condition

	var _model = new VirtualDeviceModel(_self, type, asReference)

	var _view = new VirtualDeviceView(_self)
	
	/**
	 * This function is looking for an device with SYS_ID
	 * @param SYS_ID - internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID){
		if (this.SYS_ID == SYS_ID) {
			return _self
		}
		return null
	}
	
	/**
	 * Removes all recursive includes Elements
	 * @return true, if success
	 */
	this.removeElements = function(){
		
		var paramObj = _model.getParamObj()
		delete paramObj
		
		if(typeof paramObj !== 'undefined')
			return false
			
		return true
	}
	
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
}

var VirtualDeviceModel = function(controller, id, asReference) {

	var _self = this

	var _controller = controller

	var _id = id

	var _asReference = asReference

	var _params = (asReference ? new RefParams() : _params = new Params())

	/**
	 * Return ID
	 * 
	 * @return ID
	 */
	this.getID = function() {
		return _id
	}


	/**
	 * Returns a flag value if it true the vdev can add to conditions
	 * 
	 * @return boolean
	 */
	this.getAsReference = function() {
		return _asReference
	}

	/**
	 * Return the parameter object of device. Note: Please do type checking of
	 * types "Params" and "RefParams" before use
	 * 
	 * @return parameter object
	 */
	this.getParamObj = function() {
		return _params
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = {}
		tmp['TYPE'] = _id

		if (_params instanceof RefParams)
			tmp['REF_PARAMS'] = _params
		else
			tmp['PARAMS'] = _params
		return tmp
	}

}

var VirtualDeviceView = function(controller) {

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		return '<span class="placeholder"> VDEV </span>'
	}

}
