var _ = require('underscore');

var path = require('path');
var fs = require('fs');
var events = require('events');
var KlassyEventEmitter = klass(events.EventEmitter);
var Applyr = require('applyr');
var Configr = require("../configr");

var MongoPersister = KlassyEventEmitter.extend(function(config) {
    Applyr.applyConfigTo(this, config, this.defaults());

    if (this.autoloadObjectsWithConfig && !MongoPersister.alreadyLoadedDefaultData) {
        this.once('ready', function() {
            Configr.loadAndPersistAll(this.persistableObjectDir, this.persistableObjectConfigDir);
            MongoPersister.alreadyLoadedDefaultData = true;
        }.bind(this));
    }
}).methods({
        defaults: function() {
            return {
                port: 27017,
                host: 'localhost',
                autoloadObjectsWithConfig: true
            }
        },

        start: function() {
//            console.log("MongoPersister: registering collections");
            var pclasses = MongoPersister._registerCollections(this.persistableObjectDir);

            this.once("collectionsReady", function() {
//                console.log("MongoPersister: starting db");
                MongoPersister._connectToDb(this.dbConfig);
                this.emit("ready");
            }.bind(this));
            this._checkPersistableCollectionsAllLoaded(pclasses);


        },

        _checkPersistableCollectionsAllLoaded: function(pobs) {
            var loaded = true;
            for (var i = 0; i < pobs.length; i++) {

                var isLoaded = _.indexOf(MongoPersister.collections, pobs[i].collectionName) !== -1;

                loaded = loaded && isLoaded;
            }

            if (!loaded) {
//                console.log("collections not loaded, waiting 1000ms and trying again");
                setTimeout(this._checkPersistableCollectionsAllLoaded.bind(this), 1000, pobs);
            } else {
//                console.log("collections all loaded");
                this.emit("collectionsReady");
            }
        }
    }).statics({
        alreadyLoadedDefaultData: false,
        collections: [],
        getClient: function() {
            return MongoPersister.client;
        },

        _registerCollections: function(pobjDir) {
            //first make sure all the persistable classes have been registered
            var pobPath = pobjDir;
            var pobFiles = fs.readdirSync(pobPath);
            var pclasses = [];
            for (var i = 0; i < pobFiles.length; i++) {
                var pclassPath = pobPath + "/" + pobFiles[i];

                pclasses.push(require(pclassPath));
            }
            return pclasses;
        },

        _connectToDb: function(dbConfig) {
            //checks for environmental variables for heroku compatibility
            var url = process.env.MONGOLAB_URI || 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.db;
            MongoPersister.client = require("mongojs").connect(url, MongoPersister.collections);
        },

        registerCollection: function(collectionName) {
            MongoPersister.collections.push(collectionName);
        }
    });

module.exports = MongoPersister;