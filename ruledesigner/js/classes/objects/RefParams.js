var RefParams = function() {

	var _self = this

	// Generate SYS_ID
	// this.SYS_ID = cSYS_ID()

	var _model = new RefParamsModel(_self)

	var _view = new RefParamsView(_self)
	
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

var RefParamsModel = function(controller) {

	var _self = this

	var _controller = controller

	var _data = {}

	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		var bool = true 
		for(var key in _data){
			if(!(delete _data[key]))
				bool=false
		}
		
		if(bool && Object.keys(_data).length == 0)
			return true

		return false
	}
	
	/**
	 * Add a RefParameter, when not exists
	 * 
	 * @param RefParameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.addRefParam = function(RefParam, op, value) {

		if (arguments.length < 3)
			throw LowerArgumentsException

		if (typeof _data[RefParam] === 'undefined') {
			_data[RefParam] = [ op, value ] // Add array with first value
			for (var n = 3; n < arguments.length; n++)
				// Add other arguments
				_data[RefParam].push(arguments[n])
			return true
		}
		return false
	}

	/**
	 * Update a RefParameter, when exists
	 * 
	 * @param RefParameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.updateRefParam = function(RefParam, op, value) {
		if (arguments.length < 3)
			throw LowerArgumentsException

		if (typeof _data[RefParam] !== 'undefined') {
			_data[RefParam] = [ op, value ] // Add array with first value
			for (var n = 3; n < arguments.length; n++)
				// Add other arguments
				_data[RefParam].push(arguments[n])
			return true
		}
		return false
	}

	/**
	 * This is a forcing set up of parameters - olds are deleting
	 * The value must be an array of [operand as string, value, value ]
	 * @param -
	 *            Set of parameters as key-value object	 
	 * @return boolean - true if success
	 */
	this.setRefParameter = function(data) {
	
		if (!(data instanceof Object))
			return false
			
		for (var key in data) {              // DONE: data validation
			if (!Array.isArray(data[key]))   // data object should include arrays only with
				return false			
			if(data[key].length < 2)         // two parameter at minimum
				return false
		}

		delete _data
		_data = data
		return true
		
	}

	/**
	 * Returns the value of given RefParameter
	 * 
	 * @param string /
	 *            key
	 * @return parameter value
	 */
	this.getRefParamValue = function(RefParam) {
		return _data[RefParam]
	}

	/**
	 * Function for deleting parameters
	 * 
	 * @param string
	 */
	this.removeRefParam = function(RefParam) {
		if (typeof _data[RefParam] !== 'undefined') {
			delete _data[RefParam]
			if (typeof _data[RefParam] === 'undefined')
				return true
		}
		return false
	}

	/**
	 * Returns the key set of parameter
	 * 
	 * @return object
	 */
	this.getRefParameter = function() {
		return _data
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		return _data
	}

}

var RefParamsView = function(controller) {

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		return '' // TODO:
	}

}
