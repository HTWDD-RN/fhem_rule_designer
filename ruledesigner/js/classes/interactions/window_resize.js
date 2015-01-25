/**
 * TODO
 */
$(window).resize(
		function() {
			
			var events = new Events()

			var ID = {
				DRAGBAR : '#' + Configuration.GUI.DRAGBAR.ID,
				TOOLBAR : '#' + Configuration.GUI.TOOLBAR.ID,
				EDITOR : '#' + Configuration.GUI.EDITOR.ID,
				ADDS : '#' + Configuration.GUI.ADDITIONALS.ID
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
			
			$(ID.DRAGBAR + ' li.ui-objlist-head').css('display', 'block');

			if (width >= 720) {
				$(ID.DRAGBAR + ' ul.ui-objlist').css('margin-right', margin);

				events.disableMenuButton()

				height -= ($(ID.TOOLBAR).height() + 4 * margin)
				width -= draggbar_width;

				$(ID.ADDS).css('overflow-x', 'hidden')
				$(ID.ADDS).css('width', draggbar_width - 8);
				$(ID.ADDS).css('float', 'left');
				
				$(ID.DRAGBAR).css('overflow-x', 'hidden')
				$(ID.DRAGBAR).css('height', height-$(ID.ADDS).height()-margin);
				$(ID.DRAGBAR).css('width', draggbar_width - 8);
				$(ID.DRAGBAR).css('float', 'left');
				$(ID.DRAGBAR + ' li').css('padding', '2px 5px');

				var width2 = draggbar_width / 2 - (2 + 1) * margin - 8;
				$(ID.DRAGBAR + ' li:not(.ui-objlist-head)').css('width', width2);

				$(ID.EDITOR).css('width', width - 1 * margin - 16);
				$(ID.EDITOR).css('margin-left', 0);
				$(ID.EDITOR).css('height', height);
				$(ID.EDITOR).css('float', 'right');
				$(ID.EDITOR + ' > div').css(
						'height',
						height - topMargin - margin
								- $(ID.EDITOR + ' > ul:first').height() - 8);

			} else if (width >= 480) {
				$(ID.DRAGBAR + ' ul.ui-objlist').css('margin-right', margin);

				events.disableMenuButton()

				height -= ($(ID.TOOLBAR).height() + 3 * margin)
				draggbar_width = 125;
				width -= draggbar_width - 8;

				$(ID.ADDS).css('overflow-x', 'hidden')
				$(ID.ADDS).css('width', draggbar_width + 16);
				$(ID.ADDS).css('float', 'left');
				
				$(ID.DRAGBAR).css('overflow-x', 'hidden')
				$(ID.DRAGBAR).css('height', height-$(ID.ADDS).height()-2*margin);
				$(ID.DRAGBAR).css('width', draggbar_width + 16);
				$(ID.DRAGBAR).css('float', 'left');

				var width2 = draggbar_width / 1 - (1 + 1) * margin - 8;
				$(ID.DRAGBAR + ' li:not(.ui-objlist-head)').css('width', width2);

				$(ID.EDITOR).css('width', width - 1 * margin - 48);
				$(ID.EDITOR).css('margin-left', 0);
				$(ID.EDITOR).css('height', height-margin);
				$(ID.EDITOR).css('float', 'right');

				$(ID.EDITOR + ' > div').css(
						'height',
						height - topMargin - margin
								- $(ID.EDITOR + ' > ul:first').height() - 8);
			} else {
				$(ID.DRAGBAR + ' ul.ui-objlist').css('margin-right', '');
				
				events.enableMenuButton()
					
				$(ID.ADDS).css('width', '');
				$(ID.ADDS).css('height', '');
				$(ID.ADDS).css('float', '');
							
				$(ID.DRAGBAR).css('width', '');
				$(ID.DRAGBAR).css('height', '200');
				$(ID.DRAGBAR).css('float', '');
				
				height -= ($(ID.TOOLBAR).height() + 3 * margin + 200)

				$(ID.EDITOR).css('margin-left', margin);
				$(ID.EDITOR).css('margin-right', margin);
				$(ID.EDITOR).css('width', '');
				$(ID.EDITOR).css('height', height);
				$(ID.EDITOR).css('float', 'none');
				
				$(ID.EDITOR + ' > div').css(
						'height', height - $(ID.EDITOR + ' > ul:first').height()- topMargin - margin- 8)

			}
		})