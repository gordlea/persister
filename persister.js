var klass = require('klass');
var Applyr = require('applyr');
var events = require('events');
var KlassyEventEmitter = klass(events.EventEmitter);

var Persister = KlassyEventEmitter.extend(function(config) {
    Applyr.applyConfigTo(this, config, this.defaults())
}).methods({
        defaults: function() {
            return {
                backend: 'mongo'
            };
        },

        configure: function(env, fn) {
            if ('function' == typeof env) {
                env.call(this);
            } else if (env == (process.env.NODE_ENV || 'development')) {
                fn.call(this);
            }
            return this;
        },

        set: function(configKey, configValue) {
            this[configKey] = configValue;

            return this;
        },

        start: function() {
//            console.log("starting db");
            var DB = require('./dbs/' + this.backend);
            this.db = new DB({
                persistableObjectDir: this.persistableObjectDir,
                persistableObjectConfigDir: this.persistableObjectConfigDir,
                dbConfig: this.dbConfig
            });

            this.db.on('ready', function() {
//                console.log("db ready");
                this.emit('ready');
            }.bind(this));
            this.db.start();
        }

}).statics({
        setup: function(config) {
            return new Persister(config);
        },
        Persistable: require('./persistable')
    });

module.exports = Persister;