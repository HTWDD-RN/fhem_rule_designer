var Actor = function(id) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ActorModel(_self, id)

	var _view = new ActorView(_self)
	
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
	}
		
	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_events) {
		return _view.display(_model, _events)
	}
	

	/**
	 * Integrates a parameter directly, when not exists. It make a tunneling
	 * call to the addParam function of the including Params object
	 * 
	 * @param parameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.addParam = function(param, value) {
		return _model.getParamObj().addParam(param, value)
	}
	/**
	 * Update a parameter, when exists. It make a tunneling
	 * call to the updateParam function of the including Params object
	 * 
	 * @param parameter
	 * @param value
	 * @return boolean - true if success
	 */
	this.updateParam = function(param, value) {
		return _model.getParamObj().updateParam(param, value)
	}

	/**
	 * Returns parameter as key/value-object. In difference to the local
	 * getParamObj function it make a tunneling call to the getParameter
	 * function of the including Params object
	 * 
	 * @return getParaeter
	 */
	this.getParameter = function() {
		return _model.getParamObj().getParameter()
	}

	/**
	 * Returns the value of given Parameter. It make a tunneling call to the
	 * getParamValue function of the including Params object
	 * 
	 * @param string /
	 *            key
	 * @return parameter value
	 */
	this.getParamValue = function(param) {
		return _model.getParamObj().getParamValue(param)
	}
	
	/**
	 * Deletes an parameter if found. It make a tunneling call to the
	 * removeParam function of the including Params object
	 * 
	 * @param key /
	 *            parameter
	 * @return boolean - true if success
	 */
	this.removeParam = function(param) {
		return _model.getParamObj().removeParam(param)
	}

	/**
	 * This is a forcing set up of parameters - olds are deleting. It make a
	 * tunneling call to the setParameters function of the including Params
	 * object
	 * 
	 * @param -
	 *            Params object
	 * @return boolean - true if success
	 */
	this.setParameter = function(data) {
		return _model.getParamObj().setParameter(data)
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
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		_params = undefined
		if (_params === undefined) {
			_params = new Params()
			return true
		}
		return false
	}
	
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


/**
 * TODO
 */
var ActorView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		
		var tmp = document.createElement('div')
		tmp.className = 'trashable'
		tmp.setAttribute('rel', _controller.SYS_ID)
		
		// TODO
		tmp.innerHTML += '<span class="item-descr item-descr-'+ controller.SYS_ID +'">'+ 'ACTOR ID: '+ model.getID() +'</span>'
		
		var form = document.createElement('form')
				
		var row = document.createElement('div')
		// TODO - replace text field to more comfortable function
		var txt = document.createElement('textarea')
		
		txt.innerHTML += JSON.stringify(model.getParamObj().toJSON())
 		row.innerHTML += txt.outerHTML
		form.innerHTML += row.outerHTML
			
		tmp.innerHTML+= form.outerHTML
		
		return tmp.outerHTML
	}

}