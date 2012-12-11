var cluster = require('cluster'),
    env = require('./lib/config').get('env'),
    logger = require('./lib/logger'),
    app = require('./lib/app');

if(cluster.isMaster) {
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
    logger.debug('worker %s started', process.pid);
    app.start();
}