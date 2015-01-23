function Gather(gather) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new GatherModel(_self, gather)

	var _view = new GatherView(_self)

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
		var obj
		// Forall sub-objects
		var conds = _model.getConditions()
		for (var n = 0; n < conds.length; n++) {
			if ((obj = conds[n].search(SYS_ID)) != null)
				return obj
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

function GatherModel(controller, gather) {

	var _self = this

	var _controller = controller

	var _log_gather = gather

	var _conditions = []
	
	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		
		_log_gather = Configuration.MESSAGES.MESSAGE_NEED_LOG_GATHER_TYPE // Set message as default
		
		while(_conditions.length>0)
			_conditions.splice(0,1)
			
		if (_conditions.length == 0)
			return true

		return false
	}

	/**
	 * Adds condition to this conditions object
	 * 
	 * @param obj
	 *            of type Condition
	 * @return boolean - true if success
	 */
	this.addCondition = function(obj) {
		if (obj instanceof Condition || obj instanceof Gather) {
			_conditions.push(obj)
			return true
		}
		return false
	}

	/**
	 * Return the conditions as array
	 * 
	 * @return array of Condition objects
	 */
	this.getConditions = function() {
		return _conditions
	}

	/**
	 * Removes the condiions by ID or object compare
	 * 
	 * @param ID
	 *            or Condition object
	 * @return boolean - true if success
	 */
	this.removeCondition = function(SYS_ID) {
		for (var n = 0; n < _conditions.length; n++) {
			if (_conditions[n].SYS_ID == SYS_ID
					|| (SYS_ID instanceof Condition && SYS_ID === _conditions[n])) {
				_conditions.splice(n, 1)
				return true
			}
		}
		return false
	}

	/**
	 * Sets the logical information, normally there used something like AND, OR,
	 * NOT
	 * 
	 * @param string
	 *            with type
	 * @throw Exception
	 */
	this.setLogical = function(type) {
		if (type == gather)
			return false
		for (var n = 0; n < _GatherList.length; n++) {
			if (type == _GatherList[n][0])
				if (_GatherList[n][1] == -1
						|| _GatherList[n][1] >= _conditions.length) {
					_log_gather = type
					return true
				} else {
					throw 'The number of conditions is unsupported for this logical (max. '
							+ _Gatherlist[n][1]
							+ '). Please delete some conditions before.'
				}

		}
		return false
	}

	/**
	 * Gets the logical information, normally there used something like AND, OR,
	 * NOT
	 * 
	 * @return string with type
	 */
	this.getLogical = function() {
		return _log_gather
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tobj = new Object()
		
		if(_log_gather == Configuration.MESSAGES.MESSAGE_NEED_LOG_GATHER_TYPE || _log_gather == '')
			return tobj
			
		var tmp = []
		for (var n = 0; n < _conditions.length; n++) {
			tmp.push(_conditions[n].toJSON())
		}
		tobj[_log_gather] = tmp
		return tobj
	}

}

function GatherView(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		
		var _conditions = model.getConditions()
		
		var gather = document.createElement('div')
		var logical = document.createElement('span')
		logical.innerHTML = getLogical()
		gather.innerHTML = logical.outerHTML
		for(var n  = 0; n < _conditions.length; n++){
			gather.innerHTML += _conditions[n].display()
		}
		return gather
	}
}