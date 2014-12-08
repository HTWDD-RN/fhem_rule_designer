var VirtualDevice = function(){

	var _self = this
		
	var _model = new VirtualDeviceModel(_self)
	
	var _view = new VirtualDeviceView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
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
		return '<span> VDEV </span>'
	}
	
}
