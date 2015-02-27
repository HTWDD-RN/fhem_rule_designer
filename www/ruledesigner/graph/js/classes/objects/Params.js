var Params = function() {

	var _self = this

	var _model = new ParamsModel(_self)

	var _view = new ParamsView(_self)


	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){	
		eval('_self.' + keys[n] +' = _model.'+keys[n])
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
	 */
	this.addParam = function(param, value) {
		if (typeof _data[param] === 'undefined'){
			_data[param] = value
			if(_data[param] == value)
				return true
		}
		return false
	}

	/**
	 * Update a parameter, when exists, else calls add function automatically
	 * 
	 * @param parameter
	 * @param value
	 */
	this.updateParam = function(param, value) {
		if (typeof _data[param] !== 'undefined'){
			_data[param] = value
			if(_data[param] == value)
				return true
		}
		return false
	}
	
	/**
	 * This is a forcing set up of parameters - olds are deleting
	 * @param - Params object
	 */
	this.setParameter =function(data){
		if(typeof data == 'object'){
			delete _data
			_data = data
			return true
		}
		return false
	}
	
	/**
	
	 * Returns the value of given parameter
	 * 
	 * @param String
	 */
	this.getParamValue = function(param) {
		return _data[param]
	}

	/**
	 * Deletes an parameter if found
	 * @param key / parameter
	 */
	this.deleteParam = function(param) {
		if (typeof _data[param] !== 'undefined'){
			delete _data[param]		
			if (typeof _data[param] === 'undefined')
				return true
		}
		return false
	}

	/**
	 * Returns parameter object
	 * @return getParams
	 */
	this.getParams = function() {
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

var ParamsView = function(controller) {

	var _controller = controller
	
	this.display = function (model){
		return '' //TODO:
	}

}
