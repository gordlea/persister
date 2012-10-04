//var klass = require('klass');
//var Applyr = require('applyr');
//var events = require('events');
//var KlassyEventEmitter = klass(events.EventEmitter);
var EventEmitter = require('events').EventEmitter;

exports = module.exports = new EventEmitter();

exports.DB = require('./dbs/mongo');

//var Persistable = require('./persistable');
//Persistable.DB = exports.DB;
//exports.Persistable = Persistable;
var persistable = require('./persistable');
module.exports.getPersistable = function() {
    return persistable;
};

var db = null;

module.exports.start = function(config) {
    console.log("starting db");
            db = exports.DB;
            db.on('ready', function() {
                console.log("db ready");
                module.exports.emit('ready');
            });
            db.start({
                persistableObjectDir: config.persistableObjectDir,
                persistableObjectConfigDir: config.persistableObjectConfigDir,
                dbConfig: config.dbConfig,
                autoloadObjectsWithConfig: true
            });
};