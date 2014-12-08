var Actors = function(){

	var _self = this
		
	var _model = new ActorsModel(_self)
	
	var _view = new ActorsView(_self)
	
	this.display = function() {
		_view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
	
}
var ActorsModel = function(controller, id){

	var _self = this
	
	var _actors = []

	this.addActor = function(obj){
		_actors.push(obj)
	}
	
	this.removeActor = function(SYS_ID){
		// TODO: Actors.js - remove
	}
	
	this.getActors = function(){
		return _actors
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		var tmp = []
		for(n = 0; n < _actors.length; n++)
			tmp.push = _actors[n].toJSON()
		return tmp
	}

}

var ActorsView = function(controller){
	
	var _self = this

	var _controller = controller

	this.display = function(){
		
	}
	
}