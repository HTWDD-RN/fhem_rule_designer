var RefParams = function() {

	var _self = this

	var _model = new RefParamsModel(_self)

	var _view = new RefParamsView(_self)

	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){	
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}

}

var RefParamsModel = function() {

	var _self = this

	var _data = {}

	/**
	 * Add a RefParameter, when not exists, else calls update function
	 * automatically *
	 * 
	 * @RefParam RefParameter
	 * @RefParam value
	 */
	this.addRefParam = function(RefParam, op, value) {

		if(arguments.length < 3)
			throw LowerArgumentsException
			
		if (typeof _data[RefParam] === 'undefined'){
			_data[RefParam] = [ op, value ] // Add array with first value
			for (var n = 3; n < arguments.length; n++) // Add other arguments
				_data[RefParam].push(arguments[n])
			return true			
		}
		return false
	}

	/**
	 * Update a RefParameter, when exists, else calls add function automatically
	 * 
	 * @RefParam RefParameter
	 * @RefParam value
	 */
	this.updateRefParam = function(RefParam, op, value) {
		if(arguments.length < 3)
			throw LowerArgumentsException
			
		if (typeof _data[RefParam] !== 'undefined'){
			_data[RefParam] = [ op, value ] // Add array with first value
			for (var n = 3; n < arguments.length; n++) // Add other arguments
				_data[RefParam].push(arguments[n])
			return true			
		}
		return false
	}

	
	/**
	 * This is a forcing set up of parameters - olds are deleting
	 * @param - Params object
	 */
	this.setRefParameter =function(data){
		// TODO: data validation - data object should include arrays only with two parameter at minimum
		if(typeof data == 'object'){
			delete _data
			_data = data
			return true
		}
		return false
	}
	
	
	/**
	 * Returns the value of given RefParameter
	 * 
	 * @RefParam String
	 */
	this.getRefParamValue = function(RefParam) {
		return _data[RefParam]
	}

	/**
	 * 
	 */
	this.deleteRefParam = function(RefParam) {
		if (typeof _data[RefParam] !== 'undefined'){
			delete _data[RefParam]
			if(typeof _data[RefParam] === 'undefined')
				return true
		}
		return false
	}

	/**
	 * 
	 */
	this.getRefParams = function() {
		return _data
	}

	/**
	 * Build JSON tree
	 * 
	 * @return JSON object
	 */
	this.toJSON = function() {
		return _data
	}

}

var RefParamsView = function(controller) {

	var _controller = controller
	
	this.display = function(model) {
		return '' //TODO:
	}
	
}
