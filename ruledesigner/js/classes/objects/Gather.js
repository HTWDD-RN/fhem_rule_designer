function Gather(gather) {

	var _self = this

	var _model = GatherModel(_self, gather)

	var _view = GatherView(_self)

	this.display = function() {
		_view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
}

function GatherModel(contoller, gather) {

	var _self = this

	var _controller = controller

	var _log_gather = gather

	var _conditions = []

	this.addConditions = function(obj) {
		if (obj instanceof Conditions) {
			_conditions.push(obj)
		} else {
			throw "Unknown object type exception"
		}
	}
	
	this.setLogical = function(type){
		if(type == gather)
			return
		for(n = 0; n < _GatherList.length; n++){
			if(type == _Gatherlist[n][0])
				if(_Gatherlist[n][1] == -1 || _Gatherlist[n][1] >= _conditions.length){
					_log_gather = type
					return
				} else {
					throw 'The number of conditions is unsupported for this logical (max. ' + _Gatherlist[n][1] + '). Please delete some conditions before.'
				}
			
		}
	}

	this.toJSON = function(){
		var tmp = {}
		tmp[_log_gather] = $.map(
			_conditions,
			function(i, elem){
				return _conditions.toJSON()
			}
		)
		return tmp
	}

}

function GatherView(contoller) {

	var _self = this

	var _controller = controller

	this.display = function(_model) {

	}
}