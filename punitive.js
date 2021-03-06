var natural = require('natural'),
  dm = natural.DoubleMetaphone;

var fs = require('fs');
var path = 'index/';

var es = require('event-stream');
var _ = require('underscore');

var phonemes = JSON.parse(fs.readFileSync('phonemes.json', 'utf8'));
// var words = fs.readFileSync('/usr/share/dict/words', 'utf8').toString();

// find the portion of a source string that matches a phonetic sound and replace it. Returns null if a match wasn't found
function subsound(source, sound, replacement) {
  var found = false;
  // scan source looking for first instance of sound
  for (var end = 1, l = source.length; end < l; end++) {
    var test = source.substring(0, end);
    var phonetic = dm.process(test)[0];
    if (phonetic.indexOf(sound) != -1) {
      // we now know when the sound ends
      found = true;
      break;
    }
  }
  if (! found) return;
  // we found a match, now look backwards for where it starts
  for (var start = end - 1; start >= 0; start--) {
    var test = source.substring(start, end);
    var phonetic = dm.process(test)[0];
    if (phonetic === sound) {
      // found the sound's start and end offsets, replace that part of the string
      return source.substring(0, start) + replacement + source.substring(end);
    }
  }
}

function findPuns(searchstr) {
  var phonetic = dm.process(searchstr)[0];
  return _.chain(phonemes).filter(function(element) {
    // Find results with a partial phonetic match
    return element.match(phonetic);
  }).map(function(element) {
    // Read in words for matches
    try {
      return fs.readFileSync(path + element, 'utf8').toString().split('\n');
    } catch (e) {
    }
  }).flatten().filter(function(word) {
    // skip short words
    if (word.length < 4) return;
    return word;
  }).uniq().sortBy(function (word) {
    // Sort alphabetically
    return word.toLowerCase();
  }).sortBy(function (word) {
    // put matches with the system dictionary at the top
    // if (words.match(word.toString())) return -99999999999;
    // words containing the search go first
    if (word.match(searchstr)) return -999999999999;
    // phrases go last
    if (word.match(/\W/)) return 10000000 + word.split(' ').length;
    // otherwise, sort by length
    return word.length;
  }).map(function (word) {
    var result = subsound(word, phonetic, searchstr.toUpperCase());
    if (result) {
      // We found a result, append the original in parenthesis
      return result + ' (' + word + ')';
    } else {
      // ignore this one
      return '';
    }
  }).filter(function(word) {
    // Filter out results that match the original exactly
    var result = word.split(' (')[0];
    if (result.toLowerCase() === searchstr.toLowerCase()) return;
    return word;
  }).value();
}

process.stdout.write("Type a word to find puns\n> ");
es.pipeline(
  process.openStdin(),
  es.split(),
  es.map(function (searchstr, callback) {
    console.log('Looking for phonetic string ' + dm.process(searchstr)[0]);
    // write the result, appending a prompt
    callback(null, findPuns(searchstr).join('\n') + '\n> ');
  }),
  process.stdout
);
