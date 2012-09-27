var Persistable = require("../../persister").Persistable;
var _ = require('underscore');
//var Geo = require('./../../geo');
//var LL = require('./../../ll');
//var colors = require('colors');





var Ship = Persistable.extend(function(config) {
    if (this.id === undefined || this.id === null && config.number !== undefined && config.number !== null) {
        this.id = config.number.replace(/\s/, '');
    }

}).methods({
        defaults: function() {
            return {
                waypoints: [],
                waypointIndex: null,
                stream: null,
                outputKml: false
            };
        },
//        tick: function(interval) {
//
//            var logObj = {};
//            this._tickAi(interval, logObj);
//            this._tickMovement(interval, logObj);
////            console.dir(logObj);
//        },
//
//        shipsLog: function(logEntry) {
//            //console.log("Captain of %s: %s", this.name, logEntry);
//        },
//
//        _tickAi: function(interval, logObj) {
//            //            //console.log("%s tick for %d", this.name, elapsed);
//            if (this.waypoints.length === 0) {
//
//                this.waypoints = _.map(this.defaultRoute, function (point) {
//                    return new LL(point[1], point[0]);
//                });
//
//
//                this.waypointIndex = 0;
//            }
//
//            var myPosition = new LL(this.position[1], this.position[0]);
//            var nextWaypoint = this.waypoints[this.waypointIndex];
//            //find out the distance to the next waypoint
//            var distance = myPosition.distanceTo(nextWaypoint);
//            this.shipsLog("the distance to my next waypoint is " + distance + "km");
//            logObj.distanceToNext = distance;
//            if (distance < 0.01) {
//                this.shipsLog("I'm already at the waypoint, moving to the next one!");
//                this.waypointIndex++;
//
//                return this.tick(interval);
//            }
//
//
//            //calculate bearing to next waypoint
//            var bearing = myPosition.bearingTo(nextWaypoint);
//            this.shipsLog("the bearing to my next waypoint is " + (Math.round(bearing * 100)/100) + String.fromCharCode(parseInt("00B0", 16)));
//            this.shipsLog("steering to course " + (Math.round(bearing * 100)/100) + String.fromCharCode(parseInt("00B0", 16)));
//            this.course = bearing;
//
//            this.targetVelocity = Math.round(this.maxSpeed * 0.8);
//            this.shipsLog("setting target velocity to " + this.targetVelocity);
//
////            console.log("next waypoint { id: %d, dist: %dkm, bearing: %d, course: %d", this.waypointIndex, distance, bearing, this.course);
//        },
//
//        _tickMovement: function(interval, logObj) {
//            logObj.beforePosition = this.position + "";
//         var seconds = interval / 1000;
//
//            var myPosition = new LL(this.position[1], this.position[0]);
////            console.dir(myPosition);
//         if (this.velocity !== this.targetVelocity) {
//                this.velocity = this.targetVelocity;
//
//
//
//
//
////            var ratey = 60;
////            //console.log("Ratey:" + ratey);
////            var x = (Math.sqrt(ratey)) * Math.sqrt(-1 * (this.velocity/(this.velocity - this.maxSpeed)));
////            if (isNaN(x)) {
////                x = 0;
////            }
////            //console.log("x:" + x);
////
////            x += seconds;
////            var y = (this.maxSpeed * Math.pow(x,2)) / (Math.pow(x,2) + ratey);
////             if  (y > this.velocity && y > this.targetVelocity) {
////
////                 y = this.targetVelocity;
////             } else if (y < this.velocity && y < this.targetVelocity) {
////                 y = this.targetVelocity;
////             }
////            //console.log("targetVelocity: %d new speed: " + y, this.targetVelocity);
////            this.velocity = y;
//         }
////            //console.log(this.velocity + "," + seconds);
//            var distanceInMeters = this.velocity * seconds;
//this.heading = this.course;
////            //console.log("heading: %d, distanceInMeters: %d", this.heading, distanceInMeters);
//
////            console.dir(myPosition);
//            var dest = myPosition.destinationPoint(this.heading, distanceInMeters/1000);
////            console.dir(dest);
//            this.position[1] = dest.lat();
//            this.position[0] = dest.lon();
//            if (this.outputKml === true) {
//            this.stream.write(this.position[0] + "," + this.position[1] + ",0\n");
//            }
//            logObj.position = this.position;
//            logObj.velocity = this.velocity;
//            logObj.heading = this.heading;
//            logObj.waypointIndex = this.waypointIndex;
//
//        },


        getCollectionName:function () {
            return Ship.collectionName;
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
            Persistable.find(Ship.collectionName, query, function(err, docs) {
                callback(_.map(docs, function(result) {
                    return new Ship(result);
                }));
            });

        },
    collectionName:"ships"
    });




Persistable.registerCollection(Ship);
module.exports = Ship;