var natural = require('natural'),
  dm = natural.DoubleMetaphone;

var fs = require('graceful-fs');
var path = 'index/';

var rmdir = require('rimraf');
rmdir.sync(path);
fs.mkdirSync(path);

var phonemes = {};
var wordcounter = 0;

var titlere = /<title>(.*)<\/title>/;

var es = require('event-stream');
es.pipeline(
  process.openStdin(),
  es.split('</page>\n  <page>'),
  es.map(function (data, callback) {
    // for each page, find the title
    var match = data.match(titlere);
    if (match) {
      var word = match[1];
      phoneme = dm.process(match[1])[0];
      // If a phoneme was found, it wasn't a 'special' wiktionary page, and it has an English definition...
      if (phoneme && (! word.match(/:/)) && data.match('==English==')) {
        // Add it to the list of phonemes found
        phonemes[phoneme] = true;
        // append the word to the list, by phoneme
        fs.appendFile(path + phoneme, word + '\n', function(err) {
          if (err) {
            console.log(err);
          }
        });
        wordcounter++;
      }
    }
    callback();
  })
);

process.on('SIGINT', function() {
  // exit gracefully
  process.exit();
});

process.on('exit', function() {
  var result = Object.keys(phonemes);
  console.log(result.length + ' phonemes found for ' + wordcounter + ' words.');

  // write the index list to disk for use by punitive.jj
  fs.writeFileSync("phonemes.json", JSON.stringify(result.sort()));
});