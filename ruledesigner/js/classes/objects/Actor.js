var Actor = function(){

	var _self = this
		
	var _model = new ActorModel(_self)
	
	var _view = new ActorView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
	
}
var ActorModel = function(controller, id){

	var _self = this
	
	var _id = id
	
	var _params = new Params()
	
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