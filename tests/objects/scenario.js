var Persistable = require("../../persister").Persistable;
var _ = require("underscore");

var Scenario = Persistable.extend(function (config) {

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