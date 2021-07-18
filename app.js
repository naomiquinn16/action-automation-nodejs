const yargs = require('yargs');
const axios = require('axios').default;
var _ = require('lodash');

let argv = yargs.argv
let story = argv.story;
var parsedJSON = require(`./${story}`);
var actions = parsedJSON.actions;

// Step 1
if (actions) {
    if (actions[0].type === 'HTTPRequestAction') {
        let url = `${actions[0].options.url}`;
        axios.get(url, {})
        .then((response) => {
            locationData = renameKey(response, 'data', `${actions[0].name}`)
            getSunset(locationData);
        })
        .catch(err => {
            console.log(err);
        })
    }
}
else {
    console.log('Json not found')
}

const getSunset = (locationData) => {
    let url = `${actions[1].options.url}`
    var placeholders = [], // an array to collect the content between brackets
    rxp = /{{(.*?)}}/g,
    curMatch;
    replaceWith = [locationData.location.latitude, locationData.location.longitude];

    while(curMatch = rxp.exec(url)) {
        placeholders.push( curMatch[1] );
    }

    for(var i = 0; i < placeholders.length; i++) {
        url = url.replace(new RegExp('{{' + placeholders[i] + '}}', 'gi'), replaceWith[i]);
    }

    axios.get(url, {

    })
    .then((response) => {
        sunsetData = renameKey(response, 'data', 'sunset')
        getSentence(locationData, sunsetData);
    })
    .catch(err => {
        console.log(err);
    })
};

getSentence = (locationData, sunsetData) => {
    let message = `${actions[2].options.message}`;
    var placeholders = [], // an array to collect the content between brackets
    rxp = /{{(.*?)}}/g,
    curMatch;
    replaceWith = [locationData.location.city, locationData.location.country, sunsetData.sunset.results.sunset];

    while(curMatch = rxp.exec(message)) {
        placeholders.push( curMatch[1] );
    }

    for(var i = 0; i < placeholders.length; i++) {
        message = message.replace(new RegExp('{{' + placeholders[i] + '}}', 'gi'), replaceWith[i]);
    }

    console.log(message);
}


renameKey = function(obj, key, newKey) {
    if(_.includes(_.keys(obj), key)) {
      obj[newKey] = _.clone(obj[key], true);
      delete obj[key];
    }
    return obj;
}