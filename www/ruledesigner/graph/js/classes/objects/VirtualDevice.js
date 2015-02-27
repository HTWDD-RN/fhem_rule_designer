var VirtualDevice = function(type){

	var _self = this
	
	var asReference = false
	if(typeof arguments[1] !== 'undefined')
		asReference = arguments[1] // If flag set the object is handeled as condition 
		
	var _model = new VirtualDeviceModel(_self, type, asReference)
	
	var _view = new VirtualDeviceView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){	
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
}

var VirtualDeviceModel = function(controller, id, asReference){

	var _self = this
	
	var _controller = controller
	
	var _id = id
	
	var _params = (asReference ? new RefParams() : _params = new Params())
	
	/**
	 * Return the parameter object of device.
	 * Note: Please do type checking of types "Params" and "RefParams" before use
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
		tmp['TYPE'] = _id
		
		if(_params instanceof RefParams)
			tmp['REF_PARAMS'] = _params
		else
			tmp['PARAMS'] = _params
		return tmp
	}

}

var VirtualDeviceView = function(controller){

	var _controller = controller

	this.display = function(model){
		return '<span class="placeholder"> VDEV </span>'
	}
	
}
