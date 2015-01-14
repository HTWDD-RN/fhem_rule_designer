/**
 * 
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
		// TODO: Prüfung - Object types
		_virtual_device = obj
	}
	
	/**
	 * Removes virtual device
	 */
	this.removeVirtualDevice = function(){
		delete _virtual_device
		_virtual_device = null
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		if(_virual_device == null)
			throw 'Undefined virtual device'
		
		var tmp = {}
		tmp['VDEV'] = _virtual_device.toJSON()
		tmp['ACTORS'] = _actors.toJSON()
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
