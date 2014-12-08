var Conditions = function(){

	var _self = this
		
	var _model = new ConditionsModel(_self)
	
	var _view = new ConditionsView(_self)
	
	this.display = function() {
		return _view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
	
}

var ConditionsModel = function(controller, id){
	
	var _obj = null
	
	var _type = null
	
	/**
	 * Sets the actions object
	 * @param object
	 */	
	this.setObject = function(obj){
		
		if(obj instanceof Gather)
			type = "Gather"
			else if(obj instanceof Condition)
				type = "Condition"
				else throw "Unknown type of condionsexception"
				
		_obj = obj
	}
	
	/**
	 * 
	 */
	this.getObject =function(){
		return _obj
	}
	
	/**
	 * Build JSON tree
	 * @return JSON object
	 */
	this.toJSON = function (){
		return obj.toJSON()
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
			return 'Condition/Gather-placeholder'
		}
	}
	
}