
var fs = require("fs"),
    realpath = require("fs").realpathSync,
    dirname = require("path").dirname,
    basename = require("path").basename,
    join = require("path").join,
    yaml = require("js-yaml"),
    bouncy = require('bouncy'),
    EOL = require('os').EOL;


module.exports = {


    run: function (args) {

        var configFile = args[0];
        var configPath = dirname(realpath(configFile));
        var config = yaml.safeLoad(fs.readFileSync(configFile).toString());
        var tables = {};

        console.log(config);

        for (var host in config.services) {
            var node = join(configPath, config.services[host].node);
            var port = config.services[host].port
            console.log('Start:', host, node);
            tables[host] =
            require(node);
        }

        var server = bouncy(function (req, res, bounce) {
            if (tables[req.headers.host]) {
                bounce(tables[req.headers.host]);
            } else {
                res.statusCode = 404;
                res.end('Host: ' + req.headers.host);
            }
        });

        server.listen(80);

        console.log('Server running at http://127.0.0.1:1337/');
    }

};
