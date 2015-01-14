// Simulate global config
var Configuration = {
	DEBUG_LEVEL : 4
}

QUnit
		.test(
				"Test Log-object (js/classes/helpers/Log.js)",
				function(assert) {

					assert.ok(Configuration.DEBUG_LEVEL == 4,
							"Preparing (DEBUG_LEVEL is 4)")

					assert.ok(Log('Test -Console Log'),
							"Log() without additional parameters")
					assert
							.equal(Log('Test', 'Test2'), false,
									"Log() with one and more additional Parameters - last must be a number!")
					assert
							.ok(Log('Test', 'Test2', 2),
									"Log() with one and more additional Parameters - last must be a number!")
					assert
							.ok(Log('Test', 3),
									"Log() with additional Parameters, DEBUG_LEVEL 3")
					assert
							.ok(Log('Test', 4),
									"Log() with additional Parameters, DEBUG_LEVEL 4")
					assert
							.equal(Log('Test', 5), false,
									"Log() with additional Parameters fail, DEBUG_LEVEL 5")
					assert
							.equal(Log(), false,
									"Log() with without argument should - Ignored!")
				});
