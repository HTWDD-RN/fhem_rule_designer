var app = function() {
	
	// TODO: Load config
	
	// TODO: Load window resize
	
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
