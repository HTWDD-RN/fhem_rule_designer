/**
 * This classes is used for group actors and allow to add an virtual elements (e.g. delay timer)
 */
var Actorgroup = function(){

	var _self = this
		
	var _model = new ActorgroupModel(_self)
	
	var _view = new ActorgroupView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
	
}

/**
 * 
 */
var ActorgroupModel = function(controller, id){

	var _self = this
	
	var _id = id
	
	var _actors = new Actors()
	
	var _virtual_device = null
	
	/**
	 * Set a virtual device, e.g. Timer
	 * @param device object
	 */
	this.setVirtualDevice = function(obj){
		if(obj instanceof VirtualDevice){
		_virtual_device = obj
		return true
		}
		return false
	}
	
	/**
	 * Removes virtual device
	 */
	this.removeVirtualDevice = function(){
		if(_virtual_device != null){
			delete _virtual_device
			_virtual_device = null
			return true
		}
		return false
	}
	
	/**
	 * Get virtual device object
	 * @return device of type "VirtualDevice"
	 */
	this.getVirtualDevice = function(){
		return _virtual_device
	}
	
	/**
	 * This function return the actors object
	 * @return object from type 'Actors'
	 */
	this.getActors = function(){
		return _actors
	}
	
	/**
	 * Return the parameter object of device.
		 * @return parameter object 
	 */
	this.getParamObj = function(){
		return _params
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		var tmp = {}
		if(_virtual_device != null){
			tmp['VDEV'] = _virtual_device.toJSON()
			tmp['ACTORS'] = _actors.toJSON()
		}
		return tmp
	}

}

/**
 * 
 */
var ActorgroupView = function(controller){
	
	var _self = this

	var _controller = controller

	this.display = function(model){
			return '' //TODO:
		
	}
	
}
