/**
 * Function to initiate a rule object
 * 
 * @param id -
 *            itentifier
 * @param arg_0 -
 *            object of type VirtualDevice, Conditions, Actions or an array in
 *            structure of parameters ...
 * @param arg_n
 * @return rule object
 */
var Rule = function(id) {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new RuleModel(_self, (id == 'unknown' ? id += ' ('
			+ this.SYS_ID + ')' : id))

	var _view = new RuleView(_self)

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

		// Proof VirtualDevice-object
		var obj = _model.getVirtualDevice()
		if (obj != null && obj.search(SYS_ID) != null) { // No more childs
			return obj
		}

		// Proof Conditions-Object
		var obj = _model.getConditionObj()
		if (obj != null && (obj = obj.search(SYS_ID)) != null) { // Can have
																	// sub
																	// childs
			return obj
		}

		// Proof Actions-Object
		var obj = _model.getActions()
		if (obj != null && (obj = obj.search(SYS_ID)) != null) { // Can have
																	// sub
																	// childs
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
	
	/**
	 * This function identify an object and calls the each add method for it
	 * @param obj to add
	 */
	 this.addObject = function (obj) {
		if (obj instanceof Condition || obj instanceof Gather) {
			return _self.setConditionObj(obj)
		}
	 	if(obj instanceof VirtualDevice){
			return _self.setVirtualDevice(obj)	 	
	 	}
	 	if(obj instanceof Actor || obj instanceof Actorgroup){
	 		return _self.getActions().addAction(obj)
	 	}
	 	return false
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
	 * Update a parameter, when exists. It make a tunneling call to the
	 * updateParam function of the including Params object
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
	 * Returns the value of given RefParameter
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
	// var keys = Object.keys(_model)
	// for (var n = 0; n < keys.length; n++) {
	// eval('_self.' + keys[n] + ' = _model.' + keys[n])
	// }
	for ( var key in _model) {
		eval('_self.' + key + ' = _model.' + key)
	}

	if (arguments.length > 1) {
		if (arguments[1] === 'Params') {
			_model.getParamObj().setParameters(arguments[n])
		}
	}

}

var RuleModel = function(controller, id) {

	var _ID = id

	var _controller = controller

	var _params = new Params() // Array

	var _actions = new Actions() // Array

	var _conditions = null // Object

	var _virtual_device = null // Object
		
	/**
	 * TODO
	 */
	this.removeObject = function(SYS_ID){
		
		if(_conditions != null){
			if (_conditions.SYS_ID == SYS_ID){
				Log((typeof _conditions) +' '+ key + ' removed.')
				_conditions.unset()
				delete _conditions
				_conditions = null
				return true
			} else if ( _conditions instanceof Gather && _conditions.removeObject(SYS_ID)){
				return true
			}
		}
		
		if (_virtual_device != null && _virtual_device.SYS_ID == SYS_ID){
			_virtual_device.unset()
			delete _virtual_device
			_virtual_device = null
			return true
		}
		
		if(_actions.removeObject(SYS_ID)){
			return true
		}

		return false
	}
	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		var bool = true 
		
		if(!_params.unset())
			bool=false
			
		if(!_actions.unset())
			bool=false
		
		if(_conditions != null && !_conditions.unset())
				bool=false
				
		if(_virtual_device != null && !_virtual_device.unset())
				bool=false
		
		if(bool)
			return true

		return false
	}
	
	/**
	 * Gets the ID object
	 * 
	 * @return object
	 */
	this.getID = function() {
		return _ID
	}

	/**
	 * Gets parameter object as enclosed object
	 * 
	 * @return object
	 */
	this.getParamObj = function() {
		return _params
	}

	/**
	 * Gets actions object
	 * 
	 * @return object
	 */
	this.getActions = function() {
		return _actions
	}

	/**
	 * Sets the conditions object
	 * 
	 * @param object
	 *            of types Condition or Gather
	 * @return boolean - true if success
	 */
	this.setConditionObj = function(obj) {
		if (obj instanceof Condition || obj instanceof Gather) {
			delete _conditions
			_conditions = obj
			return true
		}
		return false
	}

	/**
	 * Get the conditions object
	 * 
	 * @return object
	 */
	this.getConditionObj = function() {
		return _conditions
	}

	/**
	 * Remove conditions object
	 * 
	 * @return boolean - true if success
	 */
	this.removeConditionObj = function() {
		if (_condtions != null) {
			delete _conditions
			_conditions = null
			return true
		}
		return false
	}

	/**
	 * Sets the virtual device object
	 * 
	 * @param object
	 *            of type VirtualDevice
	 * @return boolean - true if success
	 */
	this.setVirtualDevice = function(obj) {
		if (obj instanceof VirtualDevice) {
			_virtual_device = obj
			return true
		}
		return false
	}

	/**
	 * Get the virtual device object
	 * 
	 * @return object
	 */
	this.getVirtualDevice = function() {
		return _virtual_device
	}

	/**
	 * Remove virtual device
	 * 
	 * @return boolean - true if success
	 */
	this.removeVirtualDevice = function() {
		if (_virtual_device != null) {
			delete _virtual_device
			_virtual_device = null
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

		var tmp = {}

		tmp["ID"] = (_ID !== undefined ? _ID : '')
		tmp["PARAMS"] = _params.toJSON()

		if (_conditions != null)
			tmp["COND"] = _conditions.toJSON()

		tmp["ACTIONS"] = _actions.toJSON()

		if (_virtual_device != null)
			tmp["VDEV"] = _virtual_device.toJSON()

		return tmp
	}

	/**
	 * Generates short of this object information
	 * 
	 * @return JSON-object
	 */
	this.getInfo = function() {
		var tmp = {
			"ID" : (_ID !== undefined ? _ID : ''),
			"PARAMS" : _params.toJSON()
		}
		return tmp
	}
}

var RuleView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_model, _events) {
		var condObj = _model.getConditionObj()
		var vdevObj = _model.getVirtualDevice()
		var actionsObj = _model.getActions()
		
		var dp_rule = document.createElement('ul')
		dp_rule.setAttribute('rel', _controller.SYS_ID)
		dp_rule.className = 'obj_rule'
		
		// Generate sensor /Condition part
		var sensor = document.createElement('li')
		sensor.innerHTML += (Configuration.DEBUG_LEVEL >= 5) ?  'Bedingungen: <hr>' : ''
		if (condObj != null){
			sensor.innerHTML +=condObj.display()
			sensor.className = 'sensor-side'
		} else {
			var placeholder = document.createElement('span')
			placeholder.innerHTML = 'Condition / Gather objects placeholder'
			
			sensor.className = ['sensor-side', 'placeholder', 'drop-condition', 'drop-gather'].join(' ')
			sensor.setAttribute('rel', _controller.SYS_ID)
			sensor.innerHTML += placeholder.outerHTML
		}
		
		// Generate Virtual Device part
		var container = document.createElement('li')
			container.className = 'vdev'
		var vdev = document.createElement('div')
		vdev.innerHTML += (Configuration.DEBUG_LEVEL >= 5) ?  'VirtualDevice: <hr>' : ''
		if(vdevObj != null){
			vdev.innerHTML += vdevObj.display()
		} else {
			vdev.setAttribute('rel', _controller.SYS_ID)
			vdev.className  = [ 'placeholder', 'drop-vdev' ].join(' ')
			var placeholder = document.createElement('span')
			placeholder.innerHTML = 'Virtual Device placeholder'
			vdev.innerHTML += placeholder.outerHTML
		}	
		container.innerHTML += vdev.outerHTML
		
		// Generate Actions part
		var dp_actions = document.createElement('li')
		dp_actions.className = 'actor-side'
		dp_actions.innerHTML += (Configuration.DEBUG_LEVEL >= 5) ?  'Aktionen: <hr>' : ''
		dp_actions.innerHTML += actionsObj.display()

		// Build display rule
		dp_rule.innerHTML = [sensor.outerHTML, container.outerHTML, dp_actions.outerHTML].join("\n")
		
		return dp_rule.outerHTML
	}

}
