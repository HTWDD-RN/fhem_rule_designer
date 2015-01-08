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
 * Define static "helpers" methods
 */
var Helpers = {

	/**
	 * This function asynchronously loads an URL. You should committed the URL
	 * at minimum
	 * 
	 * @param url -
	 *            URL, address (http/https)
	 * @param data -
	 *            GET parameter [optional]
	 * @param successCallback -
	 *            call if loading is success [optional]
	 * @param errorCallback -
	 *            call if loading is corrupt [optional]
	 * @param dataFilter -
	 *            call if loading is success, call before successCallback to
	 *            prepare the result [optional]
	 */
	loadUrl : function(url, data, successCallback, errorCallback, dataFilter) {
		$.ajax({
			success : successCallback,
			error : errorCallback,
			dataFilter : dataFilter,
			type : 'GET',
			data : data,
			url : url,
			timeout : 50000
		});
	},

	/**
	 * This function asynchronously loads an JavaScript file. You should committed the URL
	 * at minimum
	 * 
	 * @param url -
	 *            URL, address (http/https)
	 * @param successCallback -
	 *            call if loading is success [optional]
	 * @param errorCallback -
	 *            call if loading is corrupt [optional]
	 */
	loadScript : function(url, successCallback, errorCallback) {
		$.ajax({
			url : url,
			dataType : "script",
			success : function(response, status) {
				successCallback()
			},
			error : function(response, status) {
				errorCallback()
			}
		});
	},

	/**
	 * load Wrapper script
	 * 
	 * @param wrapper -
	 *            normally the name of the home automation system
	 * @param successCallback -
	 *            function - is called after the loading is success
	 */
	loadWrapper : function(wrapper, successCallback) {
		var url = Configuration.HA_SVR_URL + '/ruledesigner/'
				+ Configuration.WRAPPER_URL + '/' + Configuration.WRAPPER
				+ '.js'
		console.log(url)
		this.loadScript(url, successCallback, function() {
			alert('Fehler beim Laden des Wrappers')
		})
	},

	/**
	 * load GUI script Call (new MainView()).init() for initialization
	 * 
	 * @param successCallback -
	 *            function - is called after the loading is success
	 */
	loadGUIContainer : function(successCallback) {
		this.loadScript('js/classes/MainView.js', successCallback, function() {
			alert("Fehler beim Laden der GUI-Ressourcen")
		})
	}
}

/**
 * TODO: [LOW] Move jQuery extends to an own file
 */
$.arrayIntersect = function(a, b) {
	return $.grep(a, function(i) {
		return $.inArray(i, b) > -1;
	});
};

$.arrayComplement = function(a, b) {
	return $.grep(a, function(i) {
		return $.inArray(i, b) == -1;
	});
};