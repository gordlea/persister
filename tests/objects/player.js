var Persistable = require("../../index").getPersistable();
var _ = require("underscore");
var KlassyPersistable = klass(Persistable);

var Player = KlassyPersistable.extend(function (config) {

}).methods({
        getCollectionName:function () {
            return Player.collectionName;
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
            Persistable.find(Player.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new Player(result);
                }));
            });

        },
        collectionName:"players"
    });

Persistable.registerCollection(Player);
module.exports = Player;