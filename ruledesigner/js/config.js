/**
 * 
 */

var VIRTUAL_DEVICES = [
		{
			"TYPE" : "VD_DIGITAL_TIMER",
			"NAME" : "Digital timer",
			"ALT" : "Digitale Zeitschaltuhr, welche der realen Bauweise nachempfunden ist",
			"ICON_CLASS" : "RD_DIGITAL_TIMER",
			"SETS" : [ "Weekdays", "BeginTime", "EndTime", "BeginDate",
					"EndDate" ],
			"IS_ACTOR" : true,
			"IS_SENSOR" : true,
			"IS_VDEV" : true
		},
		{
			"TYPE" : "VD_DELAY_TIMER",
			"NAME" : "Delay timer",
			"ALT" : "Ermöglicht verzögerte Ausführung von Befehlen und Schaltvorgängen",
			"ICON_CLASS" : "RD_DELAY_TIMER",
			"SETS" : [ "", "", "", ],
			"IS_ACTOR" : true,
			"IS_SENSOR" : false,
			"IS_VDEV" : true
		},
		{
			"TYPE" : "VD_RANDOM_TIMER",
			"NAME" : "Random timer",
			"ALT" : "Ermöglicht zufallsabhängiges Schalten/ Setzen von Aktoren ",
			"ICON_CLASS" : "RD_RANDOM_TIMER",
			"SETS" : [ "UpperBoundTime", "LowerBoundTime", "SwitchedTime", ],
			"IS_ACTOR" : true,
			"IS_SENSOR" : false,
			"IS_VDEV" : true
		} ]

var Configuration = {
	DEBUG_LEVEL : 5,
	// * // failure/ critical,
	// 1 // none,
	// 2 // errors,
	// 3 // warnings,
	// 4 // info (Inputs/Outputs),
	// 5 // debug

	GUI : {
		APP_CONTAINER : '.appContainer',
		MBOX_CONTAINER : '.alertContainer',
		ADDITIONALS: {
			ID: 'rd_adds'
		},
		DRAGBAR : {
			ID : 'rd_draggbar',
			OBJECT_LIST : {
				CLASSES : 'ui-tabs ui-widget ui-widget-content ui-corner-all',
				SEGMENTATION : {
					CLASSES : 'ui-objlist ui-corner-all',
					HEAD : 'ui-objlist-head ui-widget-header ui-corner-all',
					BODY : 'ui-objlist-body'
				}
			}
		},
		TOOLBAR : {
			ID : 'rd_toolbar',
			CLASSES : 'ui-widget-header'
		},
		EDITOR: {
			ID: 'rd_rules'
		}
	},


	ID_PREFIX : "RID",
	
	MESSAGES: {
		MESSAGE_NEED_LOG_GATHER_TYPE : 'Please set logical!!!'
	},
	HA_SVR_URL : "http://localhost:8083/fhem", // here: set as absolute path
	WRAPPER : "FHEM",
	WRAPPER_URL : "wrapper", // here: set as relative path
	WRAPPER_DEFAULT_SEGMENTATION : "Classic"
}