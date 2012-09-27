var _ = require('underscore');

var path = require('path');
var fs = require('fs');
var events = require('events');
var KlassyEventEmitter = klass(events.EventEmitter);
var Applyr = require('applyr');
var Configr = require("../configr");

var MongoPersister = KlassyEventEmitter.extend(function (config) {
    var defaults = this.defaults();

    var dbConfig = {};
    Applyr.applyConfigTo(dbConfig, config.dbConfig, defaults.dbConfig);
    delete defaults.dbConfig;
    config.dbConfig = dbConfig;
    Applyr.applyConfigTo(this, config, defaults);
//    console.dir(this.dbConfig);


}).methods({
        defaults:function () {
            return {
                dbConfig:{
                    port:27017,
                    host:'localhost'
                },
                autoloadObjectsWithConfig:true
            }
        },

        start:function () {
//            console.log("MongoPersister: registering collections");
            var pclasses = MongoPersister._registerCollections(this.persistableObjectDir);

            this.once("collectionsReady", function () {
                console.log("MongoPersister: starting db");
                MongoPersister._connectToDb(this.dbConfig);

                if (this.autoloadObjectsWithConfig) {

//                    console.time("Load and persist all");

                    Configr.loadAndPersistAll(this.persistableObjectDir, this.persistableObjectConfigDir, function () {
//                        console.timeEnd("Load and persist all");
                        console.log("should be emitting ready");
                        this.emit("ready");
                    }.bind(this));

                } else {

                    this.emit("ready");
                }
            }.bind(this));
            this._checkPersistableCollectionsAllLoaded(pclasses);


        },

        _checkPersistableCollectionsAllLoaded:function (pobs) {
            console.dir(MongoPersister.collections)
            var loaded = true;
            for (var i = 0; i < pobs.length; i++) {

                var isLoaded = _.indexOf(MongoPersister.collections, pobs[i].collectionName) !== -1;

                loaded = loaded && isLoaded;
            }

            if (!loaded) {
                console.error("collections not loaded, waiting 1000ms and trying again");
                setTimeout(this._checkPersistableCollectionsAllLoaded.bind(this), 1000, pobs);
            } else {
                console.log("collections all loaded");
                this.emit("collectionsReady");
            }
        }
    }).statics({
        alreadyLoadedDefaultData:false,
        collections:[],
        getClient:function () {
            return MongoPersister.client;
        },

        _registerCollections:function (pobjDir) {
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

        _connectToDb:function (dbConfig) {
            //checks for environmental variables for heroku compatibility
            var url = process.env.MONGOLAB_URI || dbConfig.host + '/' + dbConfig.db;
            MongoPersister.client = require("mongojs").connect(url, MongoPersister.collections);
        },

        registerCollection:function (collectionName) {
            MongoPersister.collections.push(collectionName);
        }
    });

module.exports = MongoPersister;