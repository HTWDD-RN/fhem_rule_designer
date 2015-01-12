/**
 * 
 */

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
		TOOLBAR : {
			CLASSES : '', // 'ui-widget-header ui-widget ui-widget-content
							// ui-corner-all',
		},
		OBJECT_LIST : {
			CLASSES : 'ui-tabs ui-widget ui-widget-content ui-corner-all',
			SEGMENTATION : {
				CLASSES : 'ui-objlist ui-corner-all',
				HEAD : 'ui-objlist-head ui-widget-header ui-corner-all',
				BODY : 'ui-objlist-body'
			}
		}
	},
	HA_SVR_URL : "http://localhost:8083/fhem", // here: set as absolute path
	WRAPPER : "FHEM",
	WRAPPER_URL : "wrapper", // here: set as relative path
	WRAPPER_DEFAULT_SEGMENTATION : "Classic"
}

var app = function() {
	$(window).load(function() {


		// Initialize MessageBox
		var mBox = MessageBox.getInstance()
		// mBox.enableClosingButton(false); // Disables closing button
		// mBox.show('Test', 'Message-Box Test Message') // Show for displaying
		// setup information

		// Initialize-App
		new __RuleDesigner()
	});
}()