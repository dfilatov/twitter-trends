var cluster = require('cluster'),
    fs = require('fs'),
    env = require('./lib/config').get('env'),
    logger = require('./lib/logger'),
    app = require('./lib/app');

if(cluster.isMaster) {
    if(env.socket) {
        try {
            fs.unlinkSync(env.socket);
        }
        catch(e) {}
    }

    var workersCount = env.workersCount;

    while(workersCount--) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        worker.suicide || cluster.fork();
    });

    if(env.hotReload) {
        ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(function(signal) {
            process.on(signal, function() {
                Object.keys(cluster.workers).forEach(function(id) {
                    cluster.workers[id].destroy();
                });
                process.exit();
            });
        });
    }
}
else {
    logger.info('worker %s started', process.pid);
    app.start();
}