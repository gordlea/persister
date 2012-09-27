//var _ = require('underscore');
//var klass = require('klass');
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
//var KlassyEventEmitter = klass(events.EventEmitter);
//var Applyr = require('applyr');
//var Configr = require("../configr");
var Configr = require('../configr');


exports = module.exports = new EventEmitter();

var client = null;
var collections = [];

function findPersistableClasses(poDir) {
                //first make sure all the persistable classes have been registered
            var pobFiles = fs.readdirSync(poDir);
            var pclasses = [];
            for (var i = 0; i < pobFiles.length; i++) {
                var pclassPath = path.join(poDir, pobFiles[i]);

                pclasses.push(require(pclassPath));
            }
            return pclasses;
}

function connectToDb (dbConfig) {
    //checks for environmental variables for heroku compatibility
    var url = process.env.MONGOLAB_URI || dbConfig.host + '/' + dbConfig.db;
//    console.dir(collections)
    client = require("mongojs").connect(url, collections);
}

exports.getClient = function() {
    return client;
}

module.exports.start = function(config) {
    var pclasses = findPersistableClasses(config.persistableObjectDir);

//    module.exports.on('collectionsReady', function() {
//        console.log("the collections are ready");
//    });

    connectToDb(config.dbConfig);

                if (config.autoloadObjectsWithConfig) {

//                    console.time("Load and persist all");

                    Configr.loadAndPersistAll(config.persistableObjectDir, config.persistableObjectConfigDir, function () {
//                        console.timeEnd("Load and persist all");
                        console.log("should be emitting ready");
                        module.exports.emit("ready");
                    }.bind(this));

                } else {

                    module.exports.emit("ready");
                }
};

exports.registerCollection = function (collectionType) {
    collections.push(collectionType);
};
