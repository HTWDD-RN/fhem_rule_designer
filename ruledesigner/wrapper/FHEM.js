// In debug mode the script is bind statically by index.html
// So that is bind before the rule designer main script and all others
// TODO: A possible result is to take the configuration in his own script
if( typeof Configuration != 'undefined' && Configuration != null){
	Log("Load Wrapper for FHEM", 3)
}


/**
 * This is a wrapper script for import FHEM data. FHEM is an home automation
 * system. The base are build of device protocols and helper modules. A part of
 * the last can use to build some virtual protocols. That are protocols that are
 * finally represent by software (e.g. timer).
 * 
 * The initialization is trigger by the step 3 of the rule designer
 * initialization (TODO: UPDATE - classes.js)
 */
function Wrapper() {

	// placholder for callback after load is finished
	var callback

	// This device aren't supported now. Please update if is need
	var unsupported_protocols = [ 'global', 'RESIDENTS', 'ROOMMATE', 'CUL', 'GUEST' ]

	// A default list of supported protocols, when the connection is in
	// trouble. The program is remain to try taking the connection up.
	var supported_protocols =
	// should the same as the regular results of this
	// ajax method in case of success
	[ 'ALL3076', 'ALL4000T', 'ALL4027', 'Alarm', 'BS', 'CM11', 'CO20', 'CUL',
			'CUL_EM', 'CUL_FHTTK', 'CUL_HM', 'CUL_HOERMANN', 'CUL_IR',
			'CUL_MAX', 'CUL_RFR', 'CUL_TX', 'CUL_WS', 'ComfoAir', 'EC3000',
			'ECMD', 'ECMDDevice', 'EGPM', 'EGPM2LAN', 'EIB', 'EM', 'EMEM',
			'EMGZ', 'EMT7110', 'EMWZ', 'ENECSYSGW', 'ENECSYSINV', 'ENIGMA2',
			'ESA2000', 'EnOcean', 'FBAHA', 'FBDECT', 'FHT', 'FHT8V', 'FHZ',
			'FRAMEBUFFER', 'FRM', 'FRM_AD', 'FRM_I2C', 'FRM_IN', 'FRM_LCD',
			'FRM_OUT', 'FRM_PWM', 'FRM_RGB', 'FRM_ROTENC', 'FRM_SERVO',
			'FRM_STEPPER', 'FS20', 'GDS', 'GEOFANCY', 'GUEST', 'HEATRONIC',
			'HMLAN', 'HMS', 'HMinfo', 'HTTPMOD', 'HUEBridge', 'HUEDevice',
			'I2C_BMP180', 'I2C_DS1307', 'I2C_LCD', 'I2C_MCP23017',
			'I2C_PCA9532', 'I2C_PCF8574', 'I2C_SHT21', 'I2C_TSL2561', 'IPCAM',
			'IPWE', 'IT', 'Itach_IR', 'Itach_IRDevice', 'Itach_Relay',
			'JSONMETER', 'Jabber', 'JeeLink', 'KM271', 'KOSTALPIKO', 'KS300',
			'LGTV', 'LINDY_HDMI_SWITCH', 'LIRC', 'LUXTRONIK2', 'LaCrosse',
			'Level', 'M232', 'M232Counter', 'M232Voltage', 'MAX', 'MAXLAN',
			'MPD', 'MQTT', 'MQTT_BRIDGE', 'MQTT_DEVICE', 'MSG', 'MSGFile',
			'MSGMail', 'MYSENSORS', 'MYSENSORS_DEVICE', 'NUT', 'NetIO230B',
			'Netzer', 'NetzerI2C', 'ONKYO_AVR', 'OREGON', 'OWAD', 'OWCOUNT',
			'OWDevice', 'OWFS', 'OWID', 'OWLCD', 'OWMULTI', 'OWSWITCH',
			'OWServer', 'OWTEMP', 'OWTHERM', 'OWX', 'OWX_ASYNC', 'PCA301',
			'PHTV', 'PID20', 'PIFACE', 'PIONEERAVR', 'PIONEERAVRZONE',
			'POKEYS', 'PROPLANTA', 'PushNotifier', 'Pushover', 'RESIDENTS',
			'RFXCOM', 'RFXMETER', 'RFXX10REC', 'ROOMMATE', 'RPII2C',
			'RPI_GPIO', 'Revolt', 'SCIVT', 'SHC', 'SHCdev', 'SISPM', 'SIS_PMS',
			'SML', 'SOMFY', 'STACKABLE_CC', 'STV', 'SWAP',
			'SWAP_0000002200000003', 'SWAP_0000002200000008', 'SYSMON', 'TCM',
			'TEK603', 'THZ', 'TRX', 'TRX_ELSE', 'TRX_LIGHT', 'TRX_SECURITY',
			'TRX_WEATHER', 'TUL', 'TellStick', 'Text2Speech', 'UNIRoll',
			'USBWX', 'USF1000', 'VIERA', 'VantagePro2', 'WEBCOUNT', 'WEBIO',
			'WEBIO_12DIGITAL', 'WMBUS', 'WS2000', 'WS300', 'WS3600', 'WWO',
			'Weather', 'X10', 'XBMC', 'XmlList', 'YAMAHA_AVR', 'YAMAHA_BD',
			'ZWDongle', 'ZWave', 'cloneDummy', 'harmony', 'netatmo',
			'panStamp', 'pilight', 'withings', 'xxLG7000' ]

	// A default list of supported helper_modules. If the connection is in
	// trouble, the program is remain to try going on.
	var helper_modules = [ 'at', 'autocreate', 'average', 'Calendar',
			'configDB', 'CustomReadings', 'DOIF', 'Dashboard', 'DbLog',
			'dewpoint', 'dummy', 'eventTypes', 'FHEM2FHEM', 'FHEMWEB',
			'FB_CALLMONITOR', 'FileLog', 'FLOORPLAN', 'HCS', 'HTTPSRV',
			'Heating_Control', 'holiday', 'HourCounter', 'LightScene',
			'mailcheck', 'notify', 'PRESENCE', 'PachLog', 'RSS', 'RandomTimer',
			'rain', 'readingsGroup', 'readingsHistory', 'readingsProxy',
			'remotecontrol', 'SUNRISE_EL', 'SYSSTAT', 'sequence', 'speedtest',
			'statistics', 'structure', 'SVG', 'telnet', 'Twilight',
			'THRESHOLD', 'Utils', 'WeekdayTimer', 'watchdog', 'weblink',
			'weco', 'WOL' ]

	// The following helper modules should map as devices
	var dev_helper_modules = [ ]

	// Auto-enabling following modules in DEBUG MODE (Configuration.DEBUG_LEVEL = 5)
	if(Configuration.DEBUG_LEVEL >= 5) {
		dev_helper_modules.push('dummy')
	}

	// The following helper modules should mas as virtual devices (e.g. timer like devices)
	var vdev_helper_modules = [ 'at', 'SUNRISE_EL' ]

	// A placeholder for the returned data of the FHEM list command
	// (step 2)
	var loaded_components = []

	// A placeholder for the returned devices info
	var devices = []

	// A placeholder for fetched locations
	var locations = []

	/**
	 * INIT: Load an array list of supported protocols (protocols) and helper
	 * methods
	 */
	var step1 = function() {
		Log('Load wrapper - STEP 1 - Parse supported protocols from '
				+ Configuration.HA_SVR_URL + '/docs/commandref.html', 4)
		Helpers.loadUrl(Configuration.HA_SVR_URL + '/docs/commandref.html', '',
				function(data) { // success
					data = data.replace('<body', '<body><div id="body"')
							.replace('</body>', '</div></body>');
					var uls = $('ul:first ul', $(data).filter('#body'))
					// console.log($(uls))
					supported_protocols = $('a', uls[1]).map(function() {
						return this.innerText
					}).toArray()
					// console.log(supported_protocols)
					helper_modules = $('a', uls[2]).map(function() {
						return this.innerText
					}).toArray()
					// console.log(helper_modules)
					step2()
				}, function(data) { // ERROR: Abbruch bei Aktualisierung nicht
					// notwendig
					step2()
				})
	};

	/**
	 * INIT: Get the list of activated protocols (devices are part of them) and
	 * helper modules filled by step1
	 */
	var step2 = function() {
		Log(
				'Load wrapper - STEP 2 - Load list of activated protocols and helper modules',
				4)
		Helpers.loadUrl(Configuration.HA_SVR_URL, 'cmd=list&XHR',
				function(data) { // success
					var expr = /([A-Za-z0-9_-]*):$/
					var preresult = data.split('\n');
					preresult = $.map(preresult, function(elem, i) {

						elem = $.trim(elem)

						// Filtering empty lines
						if (elem == "")
							return null

							// Filtering linked lines
						if ($('a', $('<div/>').html(elem)).size() > 0)
							return null

							// Return FHEM activated protocols && modules
						if (expr.test(elem))
							return expr.exec(elem)[1]

							// Not match
						return null
					})
					loaded_components = preresult
					step3()
				}, function(data) { // error
					// TODO: Abbruch mit Fehlermeldung
				})
	};

	/**
	 * INIT: Remove unsupported and deactivated elements from the lists which is
	 * filled by step1
	 */
	var step3 = function() {
		Log(
				'Load wrapper - STEP 3 - Filter unsupported and deactivated elements',
				4)
		Log('FHEM SUPPORTED PROTOCOLS', supported_protocols, 5);

		// Filtering manual declared unsupported protocols
		supported_protocols = $.arrayComplement(supported_protocols,
				unsupported_protocols)

		// Build intersection with loaded_components
		supported_protocols = $.arrayIntersect(supported_protocols,
				loaded_components)

		Log('FHEM ACTIVE AND DESGINER SUPPORTED PROTOCOLS',
				supported_protocols, 4);

		Log('FHEM SUPPORTED HELPER MODULES', helper_modules, 5);

		// Filtering out unloaded helper modules
		helper_modules = $.arrayIntersect(helper_modules, loaded_components)

		Log('ACTIVE HELPER MODULES:', helper_modules, 4);
		step4()
	};

	/**
	 * INIT: Load and filter list of devices
	 */
	var step4 = function() {
		Log('Load wrapper - STEP 4 - Load and filter list of devices', 4)
		var returnObj = {}
		Helpers.loadUrl(Configuration.HA_SVR_URL, 'cmd=jsonlist2&XHR=1',
			function(data) { // success
				// devices = data
				Log('Devices', data, 5)
				step5(data)
			}, function(data) { // error
				Log('No devices list load', 1)
				// TODO - Kritischer Fehler
				// Geräteliste nicht geladen
			}, function(data) { // filter data
				var tmp = $.parseJSON(data)
				if (tmp.Results !== undefined)
					if ($(tmp.Results).size() > 0) {
						return tmp.Results
					}
				return null
			})
	};
	
	/**
	 * INIT: Identify Rooms / Prepare and filter devices arguments
	 */
	var step5 = function(data) {
		Log(
			'Load wrapper - STEP 5 - Identify Rooms / Prepare and filter devices arguments',
				4)
		$
				.grep(
						data,
						function(elem, i) {

							if (elem.Internals.TYPE !== undefined
									&& 
($.inArray(elem.Internals.TYPE,	supported_protocols) > -1) || ( 
($.inArray(elem.Internals.TYPE, dev_helper_modules) > -1 || $.inArray(elem.Internals.TYPE, vdev_helper_modules) > -1)
&& 
$.inArray(elem.Internals.TYPE,	loaded_components) > -1
)) {

								// Store the location when it isn't in array yet
								if (elem.Attributes.room !== undefined
										&& $.inArray(elem.Attributes.room,
												locations) < 0) {
									locations.push(elem.Attributes.room)
								}

								var tmp = {
									ID : elem.Internals.NR,
									TYPE : elem.Internals.TYPE,
									NAME: (elem.Name || elem.Internals.NAME),
									ALT : (elem.Attributes.alias || elem.Name || elem.Internals.NAME),
									SETS : // Prepare sets
									$.grep(elem.PossibleSets.split(" "),
											function(elem, i) {
												// if( $.inArray(elem, [""]) >
												// -1 ) // Filter undefined sets
												// in splitting
												if (elem == '')
													return null
												return elem
											}),
									READINGS : // Filtering unknown or
									// undefined attributes to avoid
									// inconsistency
									$.grep(Object.keys(elem.Readings),
											function(elem, i) {
												if (/unknown.*/.test(elem))
													return null
												return elem
											}),
									LOCATION : (elem.Attributes.room || ''),
									ICON_CLASS : (elem.Attributes.icon || '')
								}
								devices.push(tmp)
								return tmp
							}
							return null
						})
		Log('IDENTIFIED LOCATIONS: ', locations, 5)
		Log('FHEM ACTIVE AND SUPPORTED DEVICES: ', devices, 5)

		// Call callback / Go back to the main controller
		Log('Callback', callback, 5)
		callback()
	};

	/**
	 * 
	 */
	// This methods are calling by creating the drag menu
	this.getAvailableSegmations = {
		defaultFunc : 'get' + (Configuration.WRAPPER_DEFAULT_SEGMENTATION || 'Location' )
	};

	/**
	 * This function generate a list of devices in dependence of location
	 * 
	 * @return list of devices sorted by location
	 */
	this.getAvailableSegmations.getLocation = function() {
		Log('FHEM:  getAvailableSegmations.getLocation', 4)
		var cat = {}
		for (var n = 0; n < locations.length; n++) {
			cat[locations[n]] = $.grep(devices, function(elem, i) {
				if (elem.LOCATION == locations[n])
					return elem
				return null
			})
		}
		Log('DEVICES (GROUP BY LOCATION)', cat, 5)
		return cat
	};

	/**
	 * This function generate a list of devices in dependence of protocols
	 * 
	 * @return list of devices sorted by protocols
	 */
	this.getAvailableSegmations.getProtocolTypes = function() {
		Log('FHEM:  getAvailableSegmations.getProtocolTypes', 4)
		var cat = {}
		for (var n = 0; n < supported_protocols.length; n++) {
			cat[supported_protocols[n]] = $.grep(devices, function(elem, i) {
				if (elem.Internals.TYPE == supported_protocols[n])
					return elem
				return null
			})
		}
		for (var n = 0; n < dev_helper_modules.length; n++) {
			cat[dev_helper_modules[n]] = $.grep(devices, function(elem, i) {
				if (elem.Internals.TYPE == dev_helper_modules[n])
					return elem
				return null
			})
		}
		Log('DEVICES (GROUP BY LOCATION)', cat, 5)
		return cat
	};

	/**
	 * 
	 */
	this.getAvailableSegmations.getClassic = function() {
		Log('FHEM:  getAvailableSegmations.getClassic', 4)
		var cat = {}
		cat.actors = $.grep(devices, function(elem, i) {
			if($.inArray(elem.TYPE, vdev_helper_modules) > -1)
				return null
			if (elem.READINGS.length > 0 )
				return elem
			return null
		})
		cat.sensors = $.grep(devices, function(elem, i) {
			if($.inArray(elem.TYPE, vdev_helper_modules) > -1)
				return null
			if (elem.SETS.length > 0)
				return elem
			return null
		})
		Log('DEVICES (GROUP BY TECHNICAL SEGMENTATION)', cat, 5)
		return cat
	};

	/**
	 * TODO: This function generate/defines a list of virtual devices
	 * 
	 * @return list of virtual devices
	 */
	this.getAvailableSegmations.getVirtualDevices = function() {
		Log('FHEM: getAvailableSegmations.getVirtualDevices', 4)
		var vdev = {}
		vdev = $.grep(devices, function(elem, i) {
			if($.inArray(elem.TYPE, vdev_helper_modules) > -1){
				return elem	
			}
			return null
		})

		Log('FILTERED_DEVICES', vdev, 5)
		return vdev
	};
	
	/**
	 * Initialization function
	 * 
	 * @param function
	 *            which is calling when function is finished
	 */
	this.init = function(retCallback) {
		Log(retCallback, 5)
		callback = retCallback
		step1();
	}
};
