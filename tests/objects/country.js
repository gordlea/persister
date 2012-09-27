var Persistable = require("../../index").Persistable;
var _ = require("underscore");

var Country = Persistable.extend(function (config) {
    if (this.id === undefined || this.id === null && config.countryCode !== undefined && config.countryCode !== null) {
        this.id = config.countryCode;
    }
}).methods({
    getCollectionName:function () {
        return Country.collectionName;
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
        Persistable.find(Country.collectionName, query, function(err, docs) {
            callback(_.map(docs, function(result) {
                return new Country(result);
            }));
        });

    },
    collectionName:"countries",
	collectionConfigPath: "countries"
});

Persistable.registerCollection(Country);

module.exports = Country;