var Params = function() {

	var _self = this

	// Generate SYS_ID
	// this.SYS_ID = cSYS_ID()

	var _model = new ParamsModel(_self)

	var _view = new ParamsView(_self)

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

var ParamsModel = function(controller) {

	var _self = this

	var _controller = controller

	var _data = {}

	/**
	 * Add a parameter, when not exists, else calls update function
	 * automatically *
	 * 
	 * @param parameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.addParam = function(param, value) {
		if (typeof _data[param] === 'undefined') {
			_data[param] = value
			if (_data[param] == value)
				return true
		}
		return false
	}

	/**
	 * Update a parameter, when exists, else calls add function automatically
	 * 
	 * @param parameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.updateParam = function(param, value) {
		if (typeof _data[param] !== 'undefined') {
			_data[param] = value
			if (_data[param] == value)
				return true
		}
		return false
	}

	/**
	 * This is a forcing set up of parameters - olds are deleting
	 * 
	 * @param -
	 *            Params object
	 * @return boolean - true if success
	 */
	this.setParameter = function(data) {
		if (typeof data == 'object') {
			delete _data
			_data = data
			return true
		}
		return false
	}

	/**
	 * 
	 * Returns the value of given parameter
	 * 
	 * @param key /
	 *            parameter
	 * @retun value
	 */
	this.getParamValue = function(param) {
		return _data[param]
	}

	/**
	 * Deletes an parameter if found
	 * 
	 * @param key /
	 *            parameter
	 * @return boolean - true if success
	 */
	this.deleteParam = function(param) {
		if (typeof _data[param] !== 'undefined') {
			delete _data[param]
			if (typeof _data[param] === 'undefined')
				return true
		}
		return false
	}

	/**
	 * Returns parameter object
	 * 
	 * @return getParams
	 */
	this.getParams = function() {
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

var ParamsView = function(controller) {

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		return '' // TODO:
	}

}
