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

var RefParamsModel = function(controller, id) {

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
		if (_data[RefParam] !== undefined)
			_self.updateRefParam(RefParam, op, value)
		else {
			_data[RefParam] = [ op, value ]
			for (n = 0; n < arguments.length; n++)
				_data[RefParam].push(arguments[n])
		}
	}

	/**
	 * Update a RefParameter, when exists, else calls add function automatically
	 * 
	 * @RefParam RefParameter
	 * @RefParam value
	 */
	this.updateRefParam = function(RefParam, op, value) {
		if (_data[RefParam] === undefined)
			_self.addRefParam(RefParam, op, value)
		else {
			_data[RefParam] = [ op, value ]
			for (n = 0; n < arguments.length; n++)
				_data[RefParam].push(arguments[n])
		}
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
		if (_data[RefParam] !== undefined)
			delete _data[RefParam]
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

var RefParamsView = function() {

	var _controller = controller
	
	this.display = function(model) {
		return '' //TODO:
	}
	
}
