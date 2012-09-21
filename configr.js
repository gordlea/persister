var klass = require("klass");
var _ = require("underscore");
var path = require('path');
var fs = require('fs');
var Applyr = require('applyr');



var Configr = klass({

}).statics({

    loadConfigs: function(configName, baseConfigPath) {
		var treatAsUnit = (configName.indexOf("units") !== -1);
        var confBasePath = baseConfigPath + "/" + configName;
        var configs = [];
        if (!fs.existsSync(confBasePath)) {
            console.error("Configr: Config directory for %s does not exist!");
            process.exit(1);
        } else {
            var confFileList = fs.readdirSync(confBasePath);
            console.log("loading %d config file(s) for %s", confFileList.length, configName);

            for (var i = 0; i < confFileList.length; i++) {

                var fileData = require(confBasePath + "/" + confFileList[i]);
	            if (Array.isArray(fileData)) {
		            _.each(fileData, function(fileConf) {
			            this._parseConf(fileConf, configs, treatAsUnit);
		            }, this);
	            } else {
		            this._parseConf(fileData, configs, treatAsUnit);
	            }

            }

        }
        return configs;
    },

	_parseConf: function(fileConf, outputArray, treatAsUnit) {
		if (treatAsUnit) {
			var members = fileConf.members;
			delete fileConf.members;

			_.each(members, function(memberConf) {
				var unitConf = {};

				Applyr.applyConfigTo(unitConf, memberConf, fileConf);

				outputArray.push(unitConf);
			});
		} else {
			outputArray.push(fileConf);
		}

	},

	loadAndPersistAll: function(baseObjectPath, baseConfigPath) {


		var pobFiles = fs.readdirSync(baseObjectPath);

		var pclasses = [];

		for (var i = 0; i < pobFiles.length; i++) {
			var pclassPath = baseObjectPath + "/" + pobFiles[i];
//			console.log("found persistable class: %s", pclassPath);
			pclasses.push(require(pclassPath));
		}

		for (i = 0; i < pclasses.length; i++ ) {
			var pclass = pclasses[i];
//			Persistable.registerCollection(pclass.collectionName);
			var path = pclass.collectionConfigPath;
			if (path === undefined || path === null) {
				continue;
			}

			var pconfigs = Configr.loadConfigs(path, baseConfigPath);

			for (var j = 0; j < pconfigs.length; j++) {
				var pinstance = new pclass(pconfigs[j]);
				pinstance.persist();
			}
		}
	}
});

module.exports = Configr;