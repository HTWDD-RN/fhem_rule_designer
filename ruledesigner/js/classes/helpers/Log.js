/**
 * This is the central logging interface. It is formatting the input arguments
 * for console output. The last argument is interpreted as security level. So,
 * you must committed minimum two arguments.
 * 
 * @param obj_1 -
 *            Objects are represented by browser console ...
 * @param obj_{n-1} -
 *            Objects are represented by browser console
 * @param obj_n =
 *            step - security layer [0 failure/ critical, 1 errors, 2 warnings,
 *            3 info (Inputs/Outputs) 4 entries/exits 5 debug ]
 */
function Log() {
	cmd = ''
	if (arguments.length > 1
			&& arguments[arguments.length - 1] <= Configuration.DEBUG_LEVEL)
		for (n = 0; n < arguments.length - 1; n++) {
			if (n > 0)
				cmd += ','
			cmd += 'arguments[' + n + ']'
		}

	if (cmd != '') {
		cmd = 'console.log(' + cmd + ')'
		eval(cmd)
	}
}

/**
 * TODO: MessageBox
 */
var MessageBox = {

	getInstance : function() {

		var _instance = null

		function SubObject() {

			var showclosingButton = true

			var object = $(Configuration.GUI.MBOX_CONTAINER)

			/**
			 * Enables/disables the visibility and function of the closing
			 * button
			 * 
			 * @param bool
			 *            true to enable / false to disable
			 */
			this.enableClosingButton = function(bool) {
				if (typeof bool === 'boolean')
					showclosingButton = bool
			}

			/**
			 * Display a message box
			 * 
			 * @param title -
			 *            a title
			 * @param message -
			 *            a message/the HTML content to show
			 */
			this.show = function(title, message) {
				object.dialog("option", "title", title);
				object.html(message || '')
				object.dialog("open");
			}

			/**
			 * Display a message box as modal
			 * 
			 * @param title -
			 *            a title
			 * @param message -
			 *            a message/the HTML content to show
			 */
			this.showAsModal = function(title, message) {
				object.dialog('option', 'modal', 'true') // Set
				this.showAsModal(title, message)
			}

			this.close = function() {
				object.dialog("close");

				// Get sure modal is disabled
				object.dialog('option', 'modal', 'false')
			}

			/**
			 * 
			 */
			this.setContent = function() {
				switch (arguments.length) {
				case 0:
					// No content to change/appending, Ignore content changing
					break;
				case 1:
					// Change content complete
					object.html(arguments[0])
					break;
				default:
					// Add content to a specific element
					// Temporäres String object
					var tmp = ''

					// Build content string
					for (n = 1; n < arguments.length; n++)
						tmp = $(tmp).append(arguments[n])

					// Aktualize the HTML content
					$(arguments[0]).html(tmp)
				}
			}

			object.dialog({

				autoOpen : false,
				draggable : false,
				resizable : false,
				show : {
					effect : "blind",
					duration : 1000
				},
				hide : {
					effect : "explode",
					duration : 1000
				}
			})
		}

		return function() {
			if (_instance == null)
				_instance = new SubObject()
			return _instance
		}()
	}

}
