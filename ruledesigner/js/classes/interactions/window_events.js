var Events = function(view) {
	var _view = view

	var flags = {
		menu : false
	}
	var ID = {
		DRAGBAR : '#' + Configuration.GUI.DRAGBAR.ID,
		TOOLBAR : '#' + Configuration.GUI.TOOLBAR.ID,
		EDITOR : '#' + Configuration.GUI.EDITOR.ID
	}

	this.enableButtonEvents = function() {

		// Toolbar buttons
		$(ID.TOOLBAR + ' a:not(.inputLoad)').button()

		$('#btnNew').click(function(e) {
			$('input[name="txtMakro"]').removeAttr('disabled');
			_view.reset()
		});

		$('#inputLoad').click(function(e) {
			if (view.loadRule()) {
				// TODO -Resetting the GUI
				$('input[name="txtMakro"]').attr('disabled', 'disabled');
			}
		});

		$('#btnLoad').click(function(e) {
			$("#inputLoad").trigger('click');
			return false;
		});

		// $('#btnSave').click(function(e) {
		//
		// });

		$('#btnSaveAs').click(function(e) {
			// if (_view.saveAsRule()) {
			// $('input[name="txtMakro"]').attr('disabled', 'disabled');
			// }
		});

	}

	this.enableMenuButton = function() {
		
		if ($("ul.ui-menu").size()){
			$('#menu.ui-menu').hide();
			flags.menu = false
			return
		}
		
		$("#menu-open").css({display:'block'})
		$("#menu").menu(); // activate menu
		$('#menu').show().hide();
		
		$('#menu-open').click(function(e) {
			if (!flags.menu) {
				$('#menu.ui-menu').show();
				flags.menu = true
			} else {
				$('#menu.ui-menu').hide();
				flags.menu = false
			}
		})

		$('#menu li').click(function(e) {
			$('#menu.ui-menu').hide();
			flags.menu = false
		})
		

	}
	this.disableMenuButton = function() {
		
		if ($("ul.ui-menu").size()){ // is menu function activated
			$('#menu.ui-menu').hide()
			$("#menu-open").css({display:'none'})
			$("#menu.ui-menu").menu('destroy'); // deactivate menu
			$('#menu').css({display:'inline-block'})
			flags.menu = false
		}		
	
	}

	/**
	 * 
	 */
	this.enableAddButton = function() {
		$('#btnAddRule').click(function() {
			_view.addRule();
		});
	}

	/**
	 * Function to enable trashing
	 */
	this.enableTrash = function() {
		$('#trash').droppable(
				{
					accept : '.ui-tabs-active',
					drop : function(event, ui) {
						var hash = $('a',$(ui.draggable)).attr('href')
								.replace('#', '') // get url
						var rel
						if ($('#' + hash).size() == 1) {
							rel = $('#' + hash).attr('rel')
						} else {
							rel = $($(event.toElement).context).attr('rel')
						}
						console.log(hash, rel);
						_view.removeElement(rel) // removeData

						$(ui.draggable).remove() // remove tab and other
						// elements
						if (hash != null) { // the hash is use for tabbing and
							// is equal to the partner container
							// id
							$('#' + hash).remove() // remove container
						}
					}
				})
	}

	/**
	 * Function to enables dragging
	 */
	this.enableItemDragging = function(elem) {
//		Log($(ID.DRAGBAR + ' li').size())

		var enableTrigger = false

		var triggerPos = function() {
	//		Log($(this).position())
			if (enableTrigger) {
				setTimeout(triggerPos, 10000)
			}
		}

		var setup = {
			revert : true,
			start : function(event, ui) {
				Log('Drg start', ui, 5)
				$(ID.DRAGBAR).css({
					overflow : 'visible'
				})
				if (Configuration.DEBUG_LEVEL >= 5)
					enableTrigger = true
				triggerPos()
			},
			drag : function(event, ui) {
			},
			stop : function(event, ui) {
				$(ID.DRAGBAR).css({
					'overflow-y' : 'scroll'
				})
				enableTrigger = false
			},
			appendTo : 'body',
			// containment: 'window',
			scroll : false,
			zIndex : 9999
		}
//		$(ID.DRAGBAR + ' li').draggable(setup)
		$(elem).draggable(setup)
	}

	/**
	 * Function to disables dragging
	 */
	this.disableItemDragging = function(elem) {
		$(elem).draggable('disable')
	}
	
	/**
	 * A generalized function for enableDrop of an specific element
	 * @param ui
	 * @param accepts
	 */
	this.enableDropElement = function(elem, accepts) {
		var setup = {
			drop : function(event, ui) {
						Log($(ui.draggable), $(ui.draggable).context, 5)
						// Get drag info

						// Destroy if drop successful and valid
						$(elem).droppable('destroy')
						$(ui.draggable).draggable('destroy')
					},
			accept :// Setup accept classes/id/elements
						(!accepts ? '' : accepts)
		}
		// Make it droppable
		$(elem).droppable(setup)
	}
	
}