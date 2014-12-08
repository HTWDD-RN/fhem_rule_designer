var Condition = function(){

	var _self = this
		
	var _model = new ConditionModel(_self)
	
	var _view = new ConditionView(_self)
	
	this.display = function() {
		_view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
	
}
var ConditionModel = function(controller, id){

	var _self = this
	
	var _id = id
	
	var _ref_params = new RefParams()
	
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
		var tmp = {}
		tmp['SENSOR'] = _id
		tmp['REF_PARAMS'] = _ref_params.toJSON()
		if(_virual_device != null)
			tmp['VDEV'] = _virtual_device.toJSON()
		return tmp
	}

}

var ConditionView = function(controller){
	
	var _self = this

	var _controller = controller

	this.display = function(){
		
	}
	
}
