const yargs = require("yargs");
const axios = require("axios").default;
var _ = require("lodash");

let argv = yargs.argv;
let story = argv.story;
var resolvedString;

if (story !== undefined) {
  var parsedJSON = require(`./${story}`);
  var actions = parsedJSON.actions;
  actionStory();
} else {
  process.exit(1);
}


async function actionStory() {
    if (actions) {
        let actionResponse = {};

        for (var i = 0; i < actions.length; i++) {
          if (actions[i].type === "HTTPRequestAction") {
            let str = `${actions[i].options.url}`;
            const name = actions[i].name;
            const rxp = /{{(.*?)}}/g;

            if (rxp.test(str)) {
              this.resolvedString = resolveString(str, actionResponse);
              await axios
              .get(this.resolvedString, {})
              .then((response) => {
                actionResponse[name] = response.data;
              })
              .catch((err) => {
                console.log(err);
              });
            } else {
              await axios
              .get(str, {})
              .then((response) => {
                actionResponse[name] = response.data;
              })
              .catch((err) => {
                console.log(err);
              });
              }
          }

          if (actions[i].type === "PrintAction") {
            let str = `${actions[i].options.message}`;
            this.resolvedString = resolveString(str, actionResponse);
            console.log(this.resolvedString);
          }
        }
      } else {
        console.log("Json not found");
      }
}

function resolveString(str, obj) {
  var placeholders = [], // an array to collect the content between brackets
  rxp = /{{(.*?)}}/g;
  var curMatch;

  while ((curMatch = rxp.exec(str))) {
    placeholders.push(curMatch[1]);
  }

  replaceWith = [];

  for (var i = 0; i < placeholders.length; i++) {
    var value = _.get(obj, placeholders[i]);
    replaceWith.push(value);
    str = str.replace(
      new RegExp("{{" + placeholders[i] + "}}", "gi"),
      replaceWith[i]
    );
  }
  return str;
}


module.exports = actionStory;
module.exports = resolveString;


