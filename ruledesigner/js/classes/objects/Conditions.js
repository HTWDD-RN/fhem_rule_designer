var Conditions = function() {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ConditionsModel(_self)

	var _view = new ConditionsView(_self)

	/**
	 * This function is looking for an device with SYS_ID
	 * 
	 * @param SYS_ID -
	 *            internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID) {
		// Proof this object
		if (this.SYS_ID == SYS_ID) {
			return _self
		}

		// Proof sub-object
		var obj = _model.getObject()
		if (obj != null && (obj = obj.search(SYS_ID)) != null) {
			return obj
		}
		return null
	}

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function() {
		return _view.display(_model)
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

var ConditionsModel = function(controller) {

	var _obj = null

	/**
	 * This function is use to reset the member variables in variable
	 * environment
	 * Here in mapping functionality for removeObject
	 * @return bool - true if successful
	 */
	this.unset = function() {
		return this.removeObject()
	}

	/**
	 * Sets the actions object
	 * 
	 * @param object
	 * @return boolean - true if success
	 */
	this.addObject = function(obj) {
		if (obj instanceof Gather || obj instanceof Condition) {
			_obj = obj
			return true
		}
		return false
	}

	/**
	 * 
	 */
	this.getObject = function() {
		return _obj
	}

	/**
	 * Remove conditions object from helper group
	 * 
	 * @return boolean - true if success
	 */
	this.removeObject = function() {
		if (_obj != null) {
			_obj = null
			return true
		}
		return false
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		return (_obj != null ? _obj.toJSON() : {})
	}

}

var ConditionsView = function(controller) {

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		var _obj = model.getObject()
		if (_obj != null) {
			return _obj.display()
		} else {
			// TODO: Platzhalter
			return '<span class="placeholder">Condition/Gather-placeholder</span>'
		}
	}

}
