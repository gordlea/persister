var Persistable = require("../../index").getPersistable();
var _ = require("underscore");
var KlassyPersistable = klass(Persistable);

var Scenario = KlassyPersistable.extend(function (config) {

}).methods({
        getCollectionName:function () {
            return Scenario.collectionName;
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
            Persistable.find(Scenario.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new Scenario(result);
                }));
            });

        },
        collectionName: "scenarios",
		collectionConfigPath: "scenarios"

});

Persistable.registerCollection(Scenario);

module.exports = Scenario;