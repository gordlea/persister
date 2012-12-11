var Persistable = require("../../index").getPersistable();
var _ = require("underscore");
var KlassyPersistable = klass(Persistable);

var Session = KlassyPersistable.extend(function (config) {
    if (this.id === undefined || this.id === null && config.countryCode !== undefined && config.countryCode !== null) {
        this.id = config.countryCode;
    }
}).methods({
        getCollectionName:function () {
            return Session.collectionName;
        }
    }).statics({
        persistBatch:function (persistableArray) {
            return Persistable.persistBatch(persistableArray);
        },
        find: function(query, callback) {

            if ( typeof query === "function") {
                callback = query;
                query = {};
            }
            Persistable.find(Session.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new Session(result);
                }));
            });

        },
        collectionName:"sessions"
    });

Persistable.registerCollection(Session);

module.exports = Session;