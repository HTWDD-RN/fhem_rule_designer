var Conditions = function(){

	var _self = this
		
	var _model = new ConditionsModel(_self)
	
	var _view = new ConditionsView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
	
}

var ConditionsModel = function(controller, id){
	
	var _obj = null
	
	var _id = id
	
	/**
	 * Sets the actions object
	 * @param object
	 */	
	this.addObject = function(obj){		
		if(obj instanceof Gather || obj instanceof Condition){
			_obj = obj
			return true
		}
		return false
	}
	
	/**
	 * 
	 */
	this.getObject =function(){
		return _obj
	}
	
	/**
	 * Remove conditions object from helper group
	 * @param ID
	 * @return true if success
	 */
	this.removeObject = function(){
		if( _obj != null ){
			delete _obj
			_obj = null
			return true
		}
		return false
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		return (_obj != null ? _obj.toJSON() : {})
	}

}

var ConditionsView = function(controller){

	var _controller = controller

	this.display = function(model){
		var _obj = model.getObject()
		if( _obj != null){
			return _obj.display()			
		} else {
			// TODO: Platzhalter
			return '<span class="placeholder">Condition/Gather-placeholder</span>'
		}
	}
	
}
