/**
 * Create a clone function
 * 
 * @param object
 *            to clone
 * @return cloned object
 */

Function.prototype.clone = function(_obj_to_clone) {
	return JSON.parse(JSON.stringify(_obj_to_clone));
};

/**
 * Set global variables
 */
(this.Vars = {
	linktypes : [ "AND", "OR", "XOR" ]
});

/**
 * This function counts his call itself
 * 
 * @returns {Function}
 */
function Counter() {
	return function() {
		var counter = 0;
		return function() {
			if (arguments[0] !== undefined) {
				counter = arguments[0];
			} else {
				counter++;
			}
			return counter;
		};
	}();
}

function LinkedList(_verify_prototype) {

	var Count = Counter();

	// Store the prototype for use the verifying
	var _proto_ = null;

	// Set the prototype on which is test, if the param is taken over.
	if (_verify_prototype !== undefined)
		_proto_ = _verify_prototype;

	/**
	 * Funkction to verify
	 * 
	 * @param prototype
	 */
	var verify = function(_obj) {
		return _obj.prototype.isPrototypeOf(_proto_);
	};

	var ObjectList = new Object();
	
	var Root = null;

	/**
	 * Item-Klasse
	 */
	function ManagedItem(_obj) {

		var _UNIQUE_ID = 'ITEM' + Count();

		this.PrevObj = null;

		this.FollowObj = null;

		this.UpObj = null;

		this.DownObj = null;

		this.Item = _obj;

		this.TimerObj = null;

		this.getUID = function() {
			return _UNIQUE_ID;
		};
	};

	ManagedItem.prototype = {

		execCallback: function(callback){
			
		},
		/**
		 * 
		 */
		getItem : function() {
			return this.Item;
		},

		/**
		 * Set the linked object which is in previous
		 * 
		 * @param _obj
		 * @returns
		 */
		setPrevObj : function(_obj) {

			if (this.PrevObj != null) { // If position occupied
				tmp = this.PrevObj; // store placed object
				_obj.PrevObj = tmp; // set the old as previous of the new
				tmp.FollowObj=_obj; // set the new object as followed
			}
			_obj.FollowObj = this;
			return this.PrevObj = _obj; // set the new object as previous

		},
		/**
		 * Set the linked object which is following up
		 * 
		 * @param _obj
		 */
		setFollowObj : function(_obj) {

			if (this.FollowObj != null) { // If position occupied
				tmp = this.FollowObj; // store placed object
				_obj.FollowObj = tmp; // set the old as follower of the new
				tmp.PrevObj = _obj; // set the new object as previous element of
									// the old
			}
			_obj.PrevObj = this;
			return this.FollowObj = _obj; // set the new object as followed
		},
		/**
		 * Returns the Representation of the stored object
		 * 
		 * @param _obj
		 * @returns string
		 */
		toString : function(_obj) {
			_obj.toString();
		}
	};

	this.getRootItem = function() {
		return Root;
	};
	
	this.getObjectsAsList = function() {
		return ObjectList;
	};
	
	this.addObject = function(_mItem, _rel) {
		
		var newObj = new ManagedItem(_mItem);
		
		eval('ObjectList.' + newObj.getUID() + '= newObj');
		
		if (Root != null) {
			eval('ObjectList.' + _rel[1] + '.setFollowObj(newObj)');
				return true;
		} else {
			Root = newObj;
			return true;
		}
	};

	this.removeObject = function(_key) {
	
		// Remove object references
		var tmp = ObjectList[key];
		
		//TODO - Handle removing root element
		
		// Is re-linking the exiting objects
		if (tmp.PrevObj != null && tmp.FollowObj != null){
			tmp.PrevObj.FollowObj = tmp.FollowObj;
			tmp.FollowObj.PrevObj = tmp.PrevObj;
		} else if (tmp.PrevObj != null) {
		 tmp.PrevObj.FollowObj = null;
		} else if (tmp.FollowObj != null) {
		 tmp.FollowObj.PrevObj = null;
		}
		
		if (tmp.UpObj != null) {
			delete tmp.UpObj;
		}
		delete tmp;
		
		
	};

	this.searchObject = function(_rel) {
		console.log('LinkedList.searchObject: ' + _rel);
		if( ObjectList[_rel]  !== undefined )
			return ObjectList[_rel];
	};
	
	this.doCallForEach = function( func, callback){

		
	}

};

console.log(this.vars);

/**
 * AbstractRuleObject
 */
function Device(_UNIQUE_ID) {

	console.log('Call CONSTRUCTOR of Devices');

	this._UNIQUE_ID = _UNIQUE_ID;

	this.Properties = new Object();

	this.readable = false;

	this.writeable = false;

	this.virtual = false;

};

Device.prototype = {
	display : function() {
		console.log('Call AbstractDevice.display');
		throw new NotImplementedException;
	}
};

/**
 * Klasse RulesDesigner TODO: Singleton
 */
function __RuleDesigner() {

	var Count = Counter();

	// BEGIN
	this.getNewRule = function() {

		/**
		 * Interne Klasse Rule
		 */
		function Rule(arguments) {

			var _UNIQUE_ID = 'RULE' + Count();

			this.Name = '[' + _UNIQUE_ID + ']';

			this.Descr = null;

			if (arguments[0] != null ) {
				this.Name = arguments[0];
				if (arguments[1] != null)
					this.Descr = arguments[1];
			} else {
				this.Name = '[' + _UNIQUE_ID + ']';
			}

			this.ObjectList = new LinkedList();
			
			this.getUID = function(){
				return _UNIQUE_ID;
			};
		}
		;

		return new Rule(arguments);
	};
	// END

	var view = new RuleDesignerView(this);

	var RuleObject = new Object;

	var Devices = new Object;

	this.init = function() {
		console.log("Initialisiere RulesDesigner");

		this.loadAjax("test_devices.json.php", "parseDevices(data)");

		view.actualize();

		// $(window).resize();
	};

	this.parseDevices = function(data) {
		console.log("parseDevices as Callback");
		$.each(data, function(key, value) {
			eval('Devices.' + value._UNIQUE_ID + ' = value');
		});
		console.log(Devices);
	};

	this.getDevices = function() {
		return Devices;
	};

	this.getRules = function() {
		return RuleObject;
	};

	// TODO - parse Macro
	this.parseMacro = function(data) {
		console.log("parseDevices as Callback");
		$.each(data, function(key, value) {
			// eval('devices.' + value._UNIQUE_ID + ' = value');
		});
		console.log(data);
	};

	/**
	 * L�dt Sensor- und Aktorinformationen
	 */
	this.loadAjax = function(_file_url, callback) {

		var self = this;

		console.log("Load Informations from server");

		$.ajax({
			type : 'GET',
			url : _file_url,
			dataType : "json",
			async : false,
			success : function(data) {
			}
		}).done(function(data) {
			eval('self.' + callback);
		});
	};

	/**
	 * NewRule
	 * 
	 */
	this.newRule = function(_name, _descr) {
		console.log('Create new rule');
		var tmpRule = this.getNewRule();
		eval('RuleObject.' + tmpRule.getUID() + '= tmpRule');
		view.addRuleTab(tmpRule);
		// console.log('Re-Initialize Rule-Designer');
		view.actualize();

		return true; // TODO: false if fail (the operation is break up over a
		// dialog)
	};

	this.deleteRule = function(_UNIQUE_ID) {
		// TODO - Verkn�pfungen in anderen Objekten l�schen
		eval('delete RuleObject.' + _UNIQUE_ID);
		view.actualize();
	};

	/**
	 * LoadRule
	 * 
	 */
	this.loadRule = function() {
		alert("loadRule");
		return true; // TODO: false if fail
	};

	/**
	 * Save rule
	 * 
	 */
	this.saveRule = function() {
		alert("saveRule");
		alert(JSON.stringify(RuleObject));
		return true; // TODO: false if fail
	};

	/**
	 * SaveAs rule
	 * 
	 */
	this.saveAsRule = function() {
		alert("saveAsRule");
		console.log(JSON.stringify(RuleObject));
		return true; // TODO: false if fail
	};

	this.generateJSONString = function() {
		return JSON.stringify(RuleObject, null, 3);
	};

	this.doEventAction = function(_task, _objInfo, _eventInfo) {

		console.log('xdoEventAction Method: ' + _task);
		console.log($(_eventInfo.target).hasClass('connector-right'));
		console.log($(_eventInfo.target).hasClass('connector-left'));

		var task = _task.split('.', 2);

		if (task[0] === undefined || task[0] == null || task[1] == undefined
				|| task[1] == null)
			return;

		switch (task[0]) {
		case 'drop':
			if (doDropEvents(task[1], _objInfo, _eventInfo))
				view.actualize();
			break;
		}
		;
	};

	var doDropEvents = function(_task, _objInfo, _eventInfo) {
		var task = new Object();
		task.method = _task.split('.', 2);
		task.source = _objInfo.attr('rel');

		var log= $(_eventInfo.target).parent('div').attr('rel');
		if ($(_eventInfo.target).attr('rel') !== undefined)
			task.target = $(_eventInfo.target).attr('rel').split('.');

		switch (task.method[0]) {
		case 'ruleTarget':
			var Rule = eval('RuleObject.' + task.target[0]);
			if (Rule === undefined)
				return false; // Break up if match, whom circle injection

			if (eval('Devices.' + task.source) !== undefined) {
				eval('var _data = Devices.' + task.source);
				var _obj = Object.clone(_data);
				console.log(_obj);
				return Rule.ObjectList.addObject(_obj, task.target);

			} else if (eval('RuleObject.' + task.source) !== undefined) {
				eval('var _data = RuleObject.' + task.source);
				var _obj = Object.clone(_data);
				console.log(_obj);
				return Rule.ObjectList.addObject(_obj, task.target);
			}
			break;

		case 'trash':
			if (_objInfo._DEVICE_ID !== undefined) {
				return eval('RuleObject.Objectlist.deleteObject('
						+ _objInfo.DEVICE_ID + ')');
			}

			if (eval('RuleObject.' + _objInfo._RULE_ID) !== undefined) {
				eval('delete RuleObject.' + _objInfo._RULE_ID);
				return true;
			}
			break;
		default:
			return false;
		}
		;
	};

	this.init();
};


this.displayMultitree(treeRoot){
	
	function goLeft(){
	
	}
	
	function goRight(){
	
	}

}


