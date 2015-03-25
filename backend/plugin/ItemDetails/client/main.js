define(['kloudspeaker/config', 'kloudspeaker/plugins', 'kloudspeaker/utils', 'kloudspeaker/ui/files'], function(config, plugins, utils, uif) {
    console.log('kloudspeaker/itemdetails');

    // item info
    var typeConfig = false;
    if (config.plugins["ItemDetails"]) {
        typeConfig = {};

        utils.eachKey(config.plugins["ItemDetails"], function(t) {
            var parts = t.split(",");
            var c = config.plugins["ItemDetails"][t];
            for (var i = 0; i < parts.length; i++) {
                var p = parts[i].trim();
                if (p.length > 0)
                    typeConfig[p] = c;
            }
        });
    }

    var getApplicableSpec = function(item) {
        var ext = (item.is_file && item.extension) ? item.extension.toLowerCase().trim() : "";
        if (ext.length === 0 || !typeConfig[ext]) {
            ext = item.is_file ? "[file]" : "[folder]";
            if (!typeConfig[ext])
                return typeConfig["*"];
        }
        return typeConfig[ext];
    }

    uif.itemDetails.registerProvider({
        id: "plugin-itemdetails",
        get: function(item, d, pd) {
            if (!typeConfig || !plugins.exists("ItemDetails")) return false;
            var spec = getApplicableSpec(item);
            if (!spec) return false;

            return {
                titleKey: "itemdetails.iteminfo.title",
                module: 'kloudspeaker/itemdetails/iteminfo',
            }
        },
        getRequestData: function(item) {
            if (!typeConfig || !plugins.exists("ItemDetails")) return false;
            var spec = getApplicableSpec(item);
            if (!spec) return false;
            return utils.getKeys(spec);
        }
    });

    return {
        getApplicableSpec: getApplicableSpec
    }
});
