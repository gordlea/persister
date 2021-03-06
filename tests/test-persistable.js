var path = require('path');
var Country = require("./objects/country");
//var Robot = require('./objects/robot');
//
module.exports = {
    setUp: function (callback) {
        var persister = require('../index');

//        var persister = require('../persister').setup({
//            persistableObjectDir: path.normalize(__dirname + '/objects'),
//            persistableObjectConfigDir: path.normalize(__dirname + '/configs'),
//            dbConfig: {
//                db: "persistertesting"
//            }

//        });
//        persister.configure(function() {
//            persister.set('backend', 'mongo');
//        });
        persister.on('ready', function() {
            console.log("got ready")
            callback();
        });
        persister.start({
            persistableObjectDir: path.normalize(__dirname + '/objects'),
            persistableObjectConfigDir: path.normalize(__dirname + '/configs'),
            dbConfig: {
                db: "persister-test",
                port:27017,
                host:'localhost'
            }

        });
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testMissingIdThrowsException: function (test) {
        var Robot = require('./objects/robot');

        var killerRobotGuy = new Robot(robotConf);
        delete killerRobotGuy.id;
        test.throws(function() {
            killerRobotGuy.persist();
        }, Error);

        test.done();
    },
    testRobotPersistsAndLoads: function(test) {
        var Robot = require('./objects/robot');

        var killerRobotGuy = new Robot(robotConf);

        killerRobotGuy.persist();


        Robot.find({ id: "t800"}, function(results) {
            test.ok(results.length === 1, "incorrect number of results");
            var loadedKillerRobotGuy = results[0];
//            console.dir(loadedKillerRobotGuy);

            var loadedId = loadedKillerRobotGuy.id;
            var expectedId = killerRobotGuy.id;
            test.strictEqual(loadedId, expectedId);
            test.deepEqual(loadedKillerRobotGuy.lasers, killerRobotGuy.lasers);
            test.deepEqual(loadedKillerRobotGuy.vocabulary, killerRobotGuy.vocabulary);

            test.done();
        });
    },

    testCountryDefaultDataLoaded: function(test) {


        Country.find(function(allCountries) {
            test.equal(allCountries.length, 250, "There should be 250 countries returned.");
            test.done();
        });
    },
    testCountryFindById: function(test) {
        Country.find({id: "CA"}, function(countriesWithIdCA) {
            test.ok(countriesWithIdCA.length === 1);
            test.equal(countriesWithIdCA[0].countryName, "Canada", "Canada should be the only country returned.");
            test.done();

        });
    },
    testCountryFindByContinentName: function(test) {

        Country.find({continentName: "North America"}, function(countriesInNorthAmerica) {
            test.ok(countriesInNorthAmerica.length === 41, "North America only has 2 countries");
            test.done();
        });
    }
};

var robotConf = {
    id: "t800",
    lasers: {
        slot1: {
            name: "Mobile Tactical High-Energy Laser mk4",
            type: "deuterium fluoride",
            wavelength: 3800, //nm
            power: 22000 //mW
        },
        slot2: {
            name: "Range Finder Laser",
            type: "diode pumped",
            wavelength: "1570", //nm
            power: 0.5 //mW
        }
    },
    vocabulary: [
        "Nice night for a walk",
        "Your clothes... give them to me, now"
    ]
};