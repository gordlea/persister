var Persistable = require("../../index").getPersistable();
var _ = require("underscore");
var KlassyPersistable = klass(Persistable);

var Robot = KlassyPersistable.extend(function (config) {
    //config is auto applied by super constructor, which is automatically called before we get here
}).methods({
        getCollectionName:function () {
            return Robot.collectionName;
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
        Persistable.find(Robot.collectionName, query, function(err, docs) {
            callback(_.map(docs, function(result) {
                return new Robot(result);
            }));
        });
    },
    collectionName:"robots"
});

Persistable.registerCollection(Robot);
module.exports = Robot;