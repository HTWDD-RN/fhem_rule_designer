var VirtualDevice = function(){

	var _self = this
		
	var _model = new VirtualDeviceModel(_self)
	
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
	
	var _id = id
	
	var _params = (asReference ? new RefParams() : _params = new Params())
	
	/**
	 * 
	 */
	this.getParams = function(){
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
