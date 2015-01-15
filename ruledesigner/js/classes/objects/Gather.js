function Gather(gather) {

	var _self = this
	
	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()
	
	var _model = new GatherModel(_self, gather)

	var _view = new GatherView(_self)

	/**
	 * Function to generate the HTML-Output
	 * return HTML-string
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

function GatherModel(controller, gather) {

	var _self = this

	var _controller = controller

	var _log_gather = gather

	var _conditions = []
	
	/**
	 * Adds condition to this conditions object
	 * @param obj of type Condition 
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
	 * @return array of Condition objects
	 */
	this.getConditions = function(obj) {
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
		for(var n = 0; n < _conditions.length; n++) {
			if( _conditions[n].SYS_ID == SYS_ID || (SYS_ID instanceof Condition && SYS_ID === _conditions[n]) ){
				_conditions.splice(n, 1)
				return true
			}
		}
		return false
	}
	
	/**
	 * Sets the logical information, normally there used something like AND, OR, NOT
	 * @param string with type
	 * @throw Exception
	 */
	this.setLogical = function(type){
		if(type == gather)
			return false
		for(var n = 0; n < _GatherList.length; n++){
			if(type == _GatherList[n][0])
				if(_GatherList[n][1] == -1 || _GatherList[n][1] >= _conditions.length){
					_log_gather = type
					return true
				} else {
					throw 'The number of conditions is unsupported for this logical (max. ' + _Gatherlist[n][1] + '). Please delete some conditions before.'
				}
			
		}
		return false
	}
	
	/**
	 * Gets the logical information, normally there used something like AND, OR, NOT
	 * @return string with type
	 */
	this.getLogical = function(){
		return _log_gather
	}
	
	/**
	 * Generates JSON-tree information
	 * @return JSON-object
	 */
	this.toJSON = function(){
		var tmp = []
		for (var n=0; n < _conditions.length; n++) {
			tmp.push(_conditions[n].toJSON())
		}
		var tobj = new Object()
		tobj[_log_gather]  = tmp
		return tobj
	}

}

function GatherView(controller) {

	var _self = this

	var _controller = controller
	
	/**
	 * Function to generate the HTML-Output
	 * return HTML-string
	 */
	this.display = function(model) {
		return '' //TODO:
	}
}