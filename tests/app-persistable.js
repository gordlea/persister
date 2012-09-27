var path = require('path');

var assert = require('assert');

var robotConf = {
    id:"t800",
    lasers:{
        slot1:{
            name:"Mobile Tactical High-Energy Laser mk4",
            type:"deuterium fluoride",
            wavelength:3800, //nm
            power:22000 //mW
        },
        slot2:{
            name:"Range Finder Laser",
            type:"diode pumped",
            wavelength:"1570", //nm
            power:0.5 //mW
        }
    },
    vocabulary:[
        "Nice night for a walk",
        "Your clothes... give them to me, now"
    ]
};

        var persister = require('../persister').setup({
            persistableObjectDir: path.normalize(__dirname + '/objects'),
            persistableObjectConfigDir: path.normalize(__dirname + '/configs'),
            dbConfig: {
                db: "persisterasserting"
            }

        });
        persister.configure(function() {
            persister.set('backend', 'mongo');
        });
        persister.on('ready', function() {
            console.log("got ready");

            var Robot = require('./objects/robot');

            var killerRobotGuy = new Robot(robotConf);

            killerRobotGuy.persist();


            Robot.find({ id: "t800"}, function(results) {
                assert.ok(results.length === 1, "incorrect number of results: " + JSON.stringify(results));
                var loadedKillerRobotGuy = results[0];
//            console.dir(loadedKillerRobotGuy);

                var loadedId = loadedKillerRobotGuy.id;
                var expectedId = killerRobotGuy.id;
                console.log(loadedId + " should === " + expectedId);
            });

            var Country = require("./objects/country");
            Country.find(function(allCountries) {
                assert.equal(allCountries.length, 250, "There should be 250 countries returned.");
                console.log("allCountries worked")
            });

            Country.find({id: "CA"}, function(countriesWithIdCA) {
                assert.ok(countriesWithIdCA.length === 1);
                assert.equal(countriesWithIdCA[0].countryName, "Canada", "Canada should be the only country returned.");

                console.log("countriesWithIdCA worked")
            });


            Country.find({continentName: "North America"}, function(countriesInNorthAmerica) {
                assert.ok(countriesInNorthAmerica.length === 41, "North America only has 2 countries");
                console.log("countriesInNorthAmerica worked")

            });



        });
        persister.start();


