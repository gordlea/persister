# persister.js

A module for node.js.

This is a library that makes saving objects to mongodb easy and transparent. It also can load default values for objects from jsons files. 

This code was originally part of a game I am working on, and so I find it usefull for loading units, teams, etc into a database from json files. It should be considered pre-alpha quality, and will be subject to massive and sweeping changes. I haven't tested it extensively, but as I use it more, bugs will get ironed out and functionality added.



## Example Snippet

Basically persister will allow you to do things like this:

```javascript
    var rob = new Robot({
		id: "rob", //required field
		name: "Robotic Operating Buddy",
		wikipediaUrl: "http://en.wikipedia.org/wiki/R.O.B."
	});
	
	rob.persist();
	// rob is now saved in the database. note that we don't yet have the mongodb 
	// _id for him, but we can search for him using using mongodb queries
	
	Robot.find({name: "Robotic Operating Buddy"}, function(results) {
		//results is always an array
		assert.equal(results.length, 1);
		assert.equal(results[0].name, "Robotic Operating Buddy");
		console.dir(results);
	});;
```

All you need to do is add a robot.js file in the right place using the one found below as a template, and this will be auto registered with mongo as a collection.

The id field is required, and every persist operation is an update-or-insert. If a record with the same id exists in the table robot, it will be updated. Otherwise, a new record is inserted.

## Full working example

First create a new node project. Your package.json should be something like this:
```json
{
    "name": "persister-example",
    "version": "0.0.1",
    "dependencies": {    
        "persister": "https://github.com/gordlea/persister/tarball/master",
    	"underscore": "1.3.3"
    }
}
```

Create a directory in your project root called configs, and inside that, create a directory called countries. Then put the following json file in it: https://raw.github.com/gordlea/persister/master/tests/configs/countries/countries.json

Create another directory in your project root called objects. This is where we will put our persistable objects. Lets add two persistable objects:

### country.js
```javascript
var Persistable = require("persister").Persistable;
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
    //this is the table/collection name that this persistable will be stored in
    collectionName:"countries",
    //this next static property is what tells persister to look for a config json file to load
    collectionConfigPath: "countries"
});

Persistable.registerCollection(Country);

module.exports = Country;
```
### robot.js
```javascript
var Persistable = require("persister").Persistable;
var _ = require("underscore");

var Robot = Persistable.extend(function (config) {
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
```

Now create an example.js with the following in it:
### example.js
```javascript
var path = require('path');
var assert = require('assert');
var Robot = require('./objects/robot');



var persister = require('persister');


// persister fires the ready event when it has registered all of your 
// collections and connected to the database
persister.on('ready', function() {
    //your database is ready, do stuff here
    
	var rob = new Robot({
		id: "rob", //required field
		name: "Robotic Operating Buddy",
		wikipediaUrl: "http://en.wikipedia.org/wiki/R.O.B."
	});
	
	rob.persist();
	// rob is now saved in the database. note that we don't yet have the mongodb 
	// _id for him, but we can search for him using using mongodb queries
	
	Robot.find({name: "Robotic Operating Buddy"}, function(results) {
		//results is always an array
		assert.equal(results.length, 1);
		assert.equal(results[0].name, "Robotic Operating Buddy");
		console.dir(results);
	});;
	
	// the Country object has a config in ./config/countries/country.json
	// this will have been auto loaded into the database because the 
	// Country object has a static property: collectionConfigPath
    var Country = require("./objects/country");

	// to load all objects of a type, simply omit the query
    Country.find(function(allCountries) {
        assert.equal(allCountries.length, 250, "There should be 250 countries returned.");
    });
	
	// some more examples
	
	// find countries with id "CA"
    Country.find({id: "CA"}, function(countriesWithIdCA) {
        assert.ok(countriesWithIdCA.length === 1);
        assert.equal(countriesWithIdCA[0].countryName, "Canada", "Canada should be the only country returned.");
		console.dir(countriesWithIdCA);
    });
	
	
	//find all countries in north america
    Country.find({continentName: "North America"}, function(countriesInNorthAmerica) {
        assert.ok(countriesInNorthAmerica.length === 41, "North America only has 41 countries");
    });
	
});
persister.start({
    persistableObjectDir: path.normalize(__dirname + '/objects'),
    persistableObjectConfigDir: path.normalize(__dirname + '/configs'),
    dbConfig: {
        db: "persister-example",
        port:27017,
        host:'localhost'
    }
});

```