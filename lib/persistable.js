var klass = require('klass');
var Applyr = require('applyr');

var DB = require('./dbs/mongo');
var _ = require('underscore');


var Persistable = function(config) {
    Applyr.applyConfigTo(this, config, this.defaults());
};

Persistable.prototype.defaults = function() {
    return {};
};

Persistable.prototype.persist = function(callback) {

    if (this.id === undefined || this.id === null) {
        throw new Error("Missing id in persistable of type " + this.getCollectionName());
    }
    var db = DB.getClient();
    if (callback === undefined) {
        db[this.getCollectionName()].update({id: this.id}, this, {upsert: true}, function(err) {
            if (err !== undefined && err !== null) {
                console.warn("error persisting object: %s", err);
            }
        });
    } else {
        db[this.getCollectionName()].update({id: this.id}, this, {upsert: true}, callback);
    }
};


Persistable.typeMap = {};
Persistable.getType= function(collectionName) {
    return Persistable.typeMap[collectionName]
}

Persistable.persistBatch= function(persistableArray) {
    _.each(persistableArray, function(element, index, list) {
        element.persist();
    });
};
Persistable.find= function(collectionName, query, callback) {
    var db = DB.getClient();
//            console.log(collectionName);
    db[collectionName].find(query, callback);
};
Persistable.registerCollection= function(collectionType) {
    Persistable.typeMap[collectionType.collectionName] = collectionType;

    var hasConfig = (collectionType.collectionConfigPath !== undefined && collectionType.collectionConfigPath !== null);

    console.log("new persistable collection registered: %s %s", collectionType.collectionName, (hasConfig ? "(has config to load)" : ""));
    DB.registerCollection(collectionType.collectionName);
};

module.exports = Persistable;