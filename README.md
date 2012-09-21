# persister.js

A module for node.js.

This is a library that makes saving objects to mongodb easy and transparent. It also can load default values for objects from jsons files. 

This code was originally part of a game I am working on, and so I find it usefull for loading units, teams, etc into a database from json files. 



## Examples

```javascript
var persister = require('../persister').setup({
    persistableObjectDir: path.normalize(__dirname + '/objects'),
    persistableObjectConfigDir: path.normalize(__dirname + '/configs'),
    dbConfig: {
        db: "persister-testing"
    }

});
//optional, mongodb is the only backend supported currently
persister.configure(function() {
    persister.set('backend', 'mongo');
});

// persister fires the ready event when it has registered all of your 
// collections and connected to the database
persister.on('ready', function() {
    callback();
});
persister.start();
```