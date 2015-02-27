var Actor = function(id){

	var _self = this
		
	var _model = new ActorModel(_self, id)
	
	var _view = new ActorView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
	
}
var ActorModel = function(controller, id){

	var _self = this
	
	var _controller = controller
	
	var _id = id
	
	var _params = new Params()
	
	/**
	 * Return the parameter object of device.
		 * @return parameter object 
	 */
	this.getParamObj = function(){
		return _params
	}
	
	/**
	 * Return ID
	 * @return ID 
	 */
	this.getID = function(){
		return _id
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		var tmp = {}
		tmp['ACTOR'] = _id
		tmp['PARAMS'] = _params.toJSON()
		return tmp
	}

}

var ActorView = function(controller){
	
	var _self = this

	var _controller = controller

	this.display = function(model){

		return '' //TODO:
	}
	
}