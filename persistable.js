var klass = require('klass');
var Applyr = require('applyr');
var Persister = require('./dbs/mongo');
var _ = require('underscore');


var Persistable = klass(function(config) {
    Applyr.applyConfigTo(this, require('events').EventEmitter);
    Applyr.applyConfigTo(this, config, this.defaults());



}).methods({
        defaults: function() {
            return {};
        },

        persist: function(callback) {

            if (this.id === undefined || this.id === null) {
                throw new Error("Missing id in persistable of type " + this.getCollectionName());
            }
            var db = Persister.getClient();
            if (callback === undefined) {
                db[this.getCollectionName()].update({id: this.id}, this, {upsert: true}, function(err) {
                    if (err !== undefined && err !== null) {
                        console.warn("error persisting object: %s", err);
                    }
                });
            } else {
                db[this.getCollectionName()].update({id: this.id}, this, {upsert: true}, callback);
            }
        }


}).statics({
        typeMap: {},
        getType: function(collectionName) {
            return Persistable.typeMap[collectionName]
        },

        persistBatch: function(persistableArray) {
            _.each(persistableArray, function(element, index, list) {
                element.persist();
            });
        },
        find: function(collectionName, query, callback) {
            var db = Persister.getClient();
            db[collectionName].find(query, callback);
        },
        registerCollection: function(collectionType) {
            Persistable.typeMap[collectionType.collectionName] = collectionType;

            var hasConfig = (collectionType.collectionConfigPath !== undefined && collectionType.collectionConfigPath !== null);

            console.log("new persistable collection registered: %s %s", collectionType.collectionName, (hasConfig ? "(has config to load)" : ""));
            Persister.registerCollection(collectionType.collectionName);
        }
    });

module.exports = Persistable;