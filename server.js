const _ = require("lodash");
const express = require("express");
const app = express();

var data = {
    RL: {
        "A": {
            name: "Singtel",
            code: "A"
        },
        "B": {
            name: "M1",
            code: "B"
        },
        "C": {
            name: "Starhub",
            code: "C"
        },
    },
};

var descriptor = {
    key: "Regional Licencees",
    name: "Regional Licencees",
    description: "A database of regional licenscees",
    typeDescriptors: [
      {
        "key" : "RL",
        "name" : "RL",
        "fields" : [
          {
            "key" : "name",
            "name" : "Name",
            "type" : {
              "name" : "text"
            }
          }, {
            "key" : "code",
            "name" : "Code",
            "type" : {
              "name" : "text"
            }
          }
        ],
        "optionsAvailable" : true,
        "fetchOneAvailable" : true
      }
    ],
    version: 1,
    protocolVersion: 1
  }

app.get("/", function (req, res) {
    res.json(descriptor);
});

app.get("/:type/options", function (req, res) {
    const type = req.params.type;

    if (!data[type]) {
        return res.status(404).send();
    }

    const query = req.query.filter || "";

    const options = _.filter(data[type], function (value) {
        return _.includes(value.name.toLowerCase(), query.toLowerCase());
    });

    res.json(_.map(options, function (value) {
        return {
            id: value.code,
            name: value.name,
        };
    }));
});

app.get("/:type/options/:id", function (req, res) {
    const type = req.params.type
    const id = req.params.id

    if (!data[type]) {
        return res.status(404).send();
    }

    const resource = data[type][id];

    if (!resource) {
        return res.status(404).send();
    }

    res.json({
        id: resource.code,
        name: resource.name,
    });
})

app.get("/:type/:id", function (req, res) {
    const type = req.params.type;
    const id = req.params.id;

    if (!data[type]) {
        return res.status(404).send();
    }

    const resource = data[type][id];

    if (!resource) {
        return res.status(404).send();
    }

    res.json(resource);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
