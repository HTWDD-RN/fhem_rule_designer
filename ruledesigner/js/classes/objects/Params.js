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

var ParamsModel = function(controller, id) {

	var _self = this

	var _data = {}

	var _type = null

	/**
	 * Add a parameter, when not exists, else calls update function
	 * automatically *
	 * 
	 * @param parameter
	 * @param value
	 */
	this.addParam = function(param, value) {
		if (_data[param] !== undefined)
			_self.updateParam
		else
			_data[param] = value
	}

	/**
	 * Update a parameter, when exists, else calls add function automatically
	 * 
	 * @param parameter
	 * @param value
	 */
	this.updateParam = function(param, value) {
		if (_data[param] === undefined)
			_self.addParam(param, value)
		else
			_data[param] = value
	}
	
	/**
	 * This is a forcing set up of parameters - olds are deleting
	 * @param - Params object
	 */
	this.setParameter =function(data){
		if(typeof data == 'Params'){
			delete _data
			this._data = data
		}
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
		if (_data[param] !== undefined)
			delete _data[param]
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
