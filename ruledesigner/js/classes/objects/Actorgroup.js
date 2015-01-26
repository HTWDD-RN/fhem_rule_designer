/**
 * This classes is used for group actors and allow to add an virtual elements
 * (e.g. delay timer)
 */
var Actorgroup = function() {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ActorgroupModel(_self)

	var _view = new ActorgroupView(_self)

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
		if (obj != null && obj.search(SYS_ID) != null) {
			return obj
		}

		// Forall actors-objects
		var actors = _model.getActors().getActors()
		for ( var key in actors) {
			if ((obj = actors[key].search(SYS_ID)) != null)
				return obj
		}

		return null
	}
	
	/**
	 * This function identify an object and calls the each add method for it
	 * @param obj to add
	 */
	 this.addObject = function(obj) {
	 	if(obj instanceof VirtualDevice){
	 		return _self.setVirtualDevice(obj)
	 	}
	 	return false
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

/**
 * 
 */
var ActorgroupModel = function(controller) {

	var _self = this

	var _controller = controller

	var _actors = new Actors()

	var _virtual_device = null
	
	/**
	 * TODO
	 */
	this.removeObject = function(SYS_ID){
		
		if(_actors.removeObject(SYS_ID)){
				return true
		}
		
		if (_virtual_device != null && _virtual_device.SYS_ID == SYS_ID){
			_virtual_device.unset()
			delete _virtual_device
			_virtual_device = null
			return true
		}

		return false
	}

	/**
	 * This function is use to reset the member variables in variable
	 * environment
	 * 
	 * @return bool - true if successful
	 */
	this.unset = function() {
		var bool = true

		if (!_actors.unset())
			bool = false

		_virtual_device = null

		if (bool && _virtual_device == null)
			return true

		return false
	}

	/**
	 * Set a virtual device, e.g. Timer
	 * 
	 * @param device
	 *            object
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
	 * Removes virtual device
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
	 * Get virtual device object
	 * 
	 * @return device of type "VirtualDevice"
	 */
	this.getVirtualDevice = function() {
		return _virtual_device
	}

	/**
	 * This function return the actors object
	 * 
	 * @return object from type 'Actors'
	 */
	this.getActors = function() {
		return _actors
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
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = {}
		if (_virtual_device != null) {
			tmp['VDEV'] = _virtual_device.toJSON()
			tmp['ACTORS'] = _actors.toJSON()
		}
		return {
			'ACTORGROUP' : tmp
		}
	}

}

/**
 * 
 */
var ActorgroupView = function(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		var placeholder = ''
		
		var result = (Configuration.DEBUG_LEVEL >= 5) ?  'Actorgroup: <hr>' : ''
		
		var actorgroup = document.createElement('ul')
		actorgroup.className = 'obj_actorgroup trashable'
		actorgroup.setAttribute('rel', _controller.SYS_ID)
		
		// VirtualDevice
		var vdev = document.createElement('li')	
		if(model.getVirtualDevice() == null){
			vdev.className = ['placeholder', 'vdev-actor', 'drop-vdev-actor'].join(' ')
			vdev.setAttribute('rel', _controller.SYS_ID)
			vdev.innerHTML += 'VirtualDevice-placeholder'
		} else {
			vdev.innerHTML += model.getVirtualDevice().display()
		}
		actorgroup.innerHTML += vdev.outerHTML
		
		var actors = model.getActors()
		if(actors.getActors().length > 0){
			var tmp = actors.display()
			actorgroup.innerHTML += tmp 
		}
		
		// Adds permanently an placeholder to the actions output	
		placeholder = document.createElement('li')
		placeholder.className = ['placeholder', 'drop-actor'].join(' ')
		placeholder.setAttribute('rel', _controller.SYS_ID)
		placeholder.innerHTML = 'Actor-placeholder'
		actorgroup.innerHTML += placeholder.outerHTML
		
		result += actorgroup.outerHTML
		return result

	}

}
