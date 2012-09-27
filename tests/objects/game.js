var Persistable = require("../../persister").Persistable;
var _ = require('underscore');

var Game = Persistable.extend(function(config) {

}).methods({
   getCollectionName: function() {
       return Game.collectionName;
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
            Persistable.find(Game.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new Game(result);
                }));
            });

        },
    collectionName: "games"
});

Persistable.registerCollection(Game);
module.exports = Game;