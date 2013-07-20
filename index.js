var cp = require('child_process');

start = function () {
	cp.fork('app.js').on('exit', function () {
		start();
	});
}

process.on('SIGINT', function () {
    process.exit(0);
});


start();
