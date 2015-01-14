function Gather(gather) {

	var _self = this

	var _model = new GatherModel(_self, gather)

	var _view = new GatherView(_self)

	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions	
	var keys = Object.keys(_model)
	for(var n =0; n < keys.length; n++){
		eval('_self.' + keys[n] +' = _model.'+keys[n])
	}
}

function GatherModel(controller, gather) {

	var _self = this

	var _controller = controller

	var _log_gather = gather

	var _conditions = []
	

	
	this.addConditions = function(obj) {
		if (obj instanceof Condition) {
			_conditions.push(obj)
			return true
		}
		return false
	}
	
	this.getConditions = function(obj) {
		return _conditions
	}
	
	this.removeConditions = function(SYS_ID) {
		for(var n = 0; n < _conditions.length; n++) {
			if( _conditions[n].getID() == SYS_ID || (SYS_ID instanceof Condition && SYS_ID === _conditions[n]) ){
				_conditions.splice(n, 1)
				return true
			}
		}
		return false
	}
	
	this.setLogical = function(type){
		if(type == gather)
			return false
		for(var n = 0; n < _GatherList.length; n++){
			if(type == _GatherList[n][0])
				if(_GatherList[n][1] == -1 || _GatherList[n][1] >= _conditions.length){
					_log_gather = type
					return true
				} else {
					throw 'The number of conditions is unsupported for this logical (max. ' + _Gatherlist[n][1] + '). Please delete some conditions before.'
				}
			
		}
		return false
	}
	
	this.getLogical = function(type){
		return _log_gather
	}
	
	this.toJSON = function(){
		var tmp = []
		for (var n=0; n < _conditions.length; n++) {
			tmp.push(_conditions[n].toJSON())
		}
		var tobj = new Object()
		tobj[_log_gather]  = tmp
		return tobj
	}

}

function GatherView(controller) {

	var _self = this

	var _controller = controller

	this.display = function(model) {
		return '' //TODO:
	}
}