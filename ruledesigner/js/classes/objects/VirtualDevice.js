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
	 * 
	 * @param SYS_ID -
	 *            internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID) {
		if (this.SYS_ID == SYS_ID) {
			return _self
		}
		return null
	}

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_events) {
		return _view.display(_model, _events)
	}

	// Bind model functions
	// var keys = Object.keys(_model)
	// for (var n = 0; n < keys.length; n++) {
	// eval('_self.' + keys[n] + ' = _model.' + keys[n])
	// }
	for ( var key in _model) {
		eval('_self.' + key + ' = _model.' + key)
	}
}

var VirtualDeviceModel = function(controller, id, asReference) {

	var _self = this

	var _controller = controller

	var _id = id

	var _asReference = asReference

	var _params = (asReference ? new RefParams() : new Params())

	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		_params = undefined
		if (_params === undefined) {
			_params = (asReference ? new RefParams() : new Params())
			return true
		}
		return false
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
			
			var tmp = document.createElement('div')
			tmp.className = 'trashable'
			tmp.setAttribute('rel', _controller.SYS_ID)
			// TODO
			tmp.innerHTML += '<span class="item-descr item-descr-'+ controller.SYS_ID +'">'+ 'VDEV ID: '+ model.getID() +'</span>'
			
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
