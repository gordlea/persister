var Persistable = require("../../index").getPersistable();
var _ = require('underscore');
var KlassyPersistable = klass(Persistable);

var UnitDefinition = KlassyPersistable.extend(function(config) {
    if (this.id === undefined || this.id === null && config.number !== undefined && config.number !== null) {
        this.id = config.number.replace(/\s/, '');
    }

}).methods({
        getCollectionName:function () {
            return UnitDefinition.collectionName;
        }
}).statics({
    persistBatch: function(persistableArray) {
        return Persistable.persistBatch(persistableArray);
    },
    find: function(query, callback) {

            if ( typeof query === "function") {
                callback = query;
                query = {};
            }
            Persistable.find(UnitDefinition.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new UnitDefinition(result);
                }));
            });

        },
    collectionName:"units",
	collectionConfigPath: "units"
    });
Persistable.registerCollection(UnitDefinition);
module.exports = UnitDefinition;