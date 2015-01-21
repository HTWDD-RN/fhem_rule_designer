$(window).resize(
		function() {
			
			var events = new Events()

			var ID = {
				DRAGBAR : '#' + Configuration.GUI.DRAGBAR.ID,
				TOOLBAR : '#' + Configuration.GUI.TOOLBAR.ID,
				EDITOR : '#' + Configuration.GUI.EDITOR.ID
			}

			var margin = 5;
			var border_size = 0; /* = 0 bei box-sizing = border-box */
			var topMargin = 2;

			var draggbar_width = 250;

			var width = $(window).width();
			var height = $(window).height()

			// AppContainer Resize
			$(
					Configuration.GUI.APP_CONTAINER + ' > div:not('
							+ ID.TOOLBAR + ')').css('margin', margin);
			$(Configuration.GUI.APP_CONTAINER + ' > div').css('margin-bottom',
					0);

			$(ID.EDITOR + ' > div').css('margin-top', topMargin);

			if (width >= 720) {

				events.disableMenuButton()

				height -= ($(ID.TOOLBAR).height() + 4 * margin)
				width -= draggbar_width;

				$(ID.DRAGBAR).css('overflow-x', 'hidden')
				$(ID.DRAGBAR).css('height', height);
				$(ID.DRAGBAR).css('width', draggbar_width - 8);
				$(ID.DRAGBAR).css('float', 'left');
				$(ID.DRAGBAR + ' li').css('padding', '2px 5px');

				var width2 = draggbar_width / 2 - (2 + 1) * margin - 10;
				$(ID.DRAGBAR + ' li').css('width', width2);
				$(ID.DRAGBAR + ' li.ui-objlist-head').css('width',
						2 * width2 + margin)

				$(ID.EDITOR).css('width', width - 1 * margin - 16);
				$(ID.EDITOR).css('margin-left', 0);
				$(ID.EDITOR).css('height', height);
				$(ID.EDITOR).css('float', 'right');
				$(ID.EDITOR + ' > div').css(
						'height',
						height - topMargin - margin
								- $(ID.EDITOR + ' > ul:first').height() - 8);

			} else if (width >= 480) {

				events.disableMenuButton()

				height -= ($(ID.TOOLBAR).height() + 2 * margin)
				draggbar_width = 125;
				width -= draggbar_width - 8;

				$(ID.DRAGBAR).css('overflow-x', 'hidden')
				$(ID.DRAGBAR).css('height', height);
				$(ID.DRAGBAR).css('width', draggbar_width + 16);
				$(ID.DRAGBAR).css('float', 'left');

				var width2 = draggbar_width / 1 - (1 + 1) * margin - 10;
				$(ID.DRAGBAR + ' li').css('width', width2);
				$(ID.DRAGBAR + ' li.ui-objlist-head').css('width', width2)

				$(ID.EDITOR).css('width', width - 1 * margin - 48);
				$(ID.EDITOR).css('margin-left', 0);
				$(ID.EDITOR).css('height', height);
				$(ID.EDITOR).css('float', 'right');

				$(ID.EDITOR + ' > div').css(
						'height',
						height - topMargin - margin
								- $(ID.EDITOR + ' > ul:first').height() - 8);
			} else {
				
				events.enableMenuButton()
				
				$(ID.DRAGBAR).css('width', '');
				$(ID.DRAGBAR).css('height', '');
				$(ID.DRAGBAR).css('float', 'none');

				$(ID.EDITOR).css('margin-left', margin);
				$(ID.EDITOR).css('width', '');
				$(ID.EDITOR).css('height', height);
				$(ID.EDITOR).css('float', 'none');

			}
		})