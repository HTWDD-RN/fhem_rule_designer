var Actor = function(id) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ActorModel(_self, id)

	var _view = new ActorView(_self)

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
var ActorModel = function(controller, id) {

	var _self = this

	var _controller = controller

	var _id = id

	var _params = new Params()

	/**
	 * Return the parameter object of device.
	 * 
	 * @return parameter object
	 */
	this.getParamObj = function() {
		return _params
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
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = {}
		tmp['ACTOR'] = _id
		tmp['PARAMS'] = _params.toJSON()
		return tmp
	}

}

var ActorView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {

		return '' // TODO:
	}

}