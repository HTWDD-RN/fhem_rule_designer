var Actors = function(){

	var _self = this
		
	var _model = new ActorsModel(_self)
	
	var _view = new ActorsView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
	
}
var ActorsModel = function(controller, id){

	var _self = this
	
	var _actors = []

	/**
	 * Add actor to helper group
	 * @param obj
	 * @return true if success
	 */
	this.addActor = function(obj){
		if( obj instanceof Actor){
			_actors.push(obj)
			return true
		}
		return false
	}
	
	/**
	 * Remove actor from helper group
	 * @param actor object or ID
	 * @return true if success
	 */
	this.removeActor = function(SYS_ID){
		for(var n = 0; n < _actors.length; n++) {
			if( _actors[n].getID() == SYS_ID || (SYS_ID instanceof Actor && SYS_ID === _actors[n]) ){
				_actors.splice(n, 1)
				return true
			}
		}
		return false
	}
	
	/**
	 * Return actors
	 * @return _actors
	 */
	this.getActors = function(){
		return _actors
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		var tmp = []
		for(var n = 0; n < _actors.length; n++){
			tmp.push(_actors[n].toJSON())
		}
		return tmp
	}

}

var ActorsView = function(controller){
	
	var _self = this

	var _controller = controller

	this.display = function(model){
		return '' //TODO:
	}
	
}