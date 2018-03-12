/*!
 * Balance80: v0.1.7
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fs = require("fs"),
      realpath = require("fs").realpathSync,
      dirname = require("path").dirname,
      basename = require("path").basename,
      join = require("path").join,
      yaml = require("js-yaml"),
      bouncy = require('bouncy');

module.exports = {

    /**
     *
     * @param args
     * @param callback
     */
    run: function (args, callback) {
        var configFile = args[0];
        var configPath = dirname(realpath(configFile));
        var config = yaml.safeLoad(fs.readFileSync(configFile).toString());
        var tables = {};

        for (var host in config.services) {
            var node = join(configPath, config.services[host].node);
            var port = config.services[host].port;
            var temp = process.env.PORT;
            process.env.PORT = port;
            console.log('Start:', host, node);
            tables[host] = port;
            require(node);
            process.env.PORT = temp;
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
    }
};
