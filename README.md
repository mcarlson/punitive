## Punitive

A node.js app to find unexpected puns based on their phonetic representation, or sound. It uses [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Main_Page) dump files for the corpus and [Double Metaphone](http://en.wikipedia.org/wiki/Metaphone#Double_Metaphone) for phonetic matching.

### Prerequisites

[Node.js v0.10.x](http://nodejs.org/download/)

Install dependencies:

    npm install

### Rebuilding the index

Download a dump of all wiktionary articles in english, e.g. http://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2:

    wget http://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2

Next, index it. This will take a while:

    bzip2 -dc enwiktionary-latest-pages-articles.xml.bz2 | node indexer.js

### Finding puns

Run punitive.js, then type words interactively at the prompt:

    node punitive.js

### Future directions

* Add a web front-end
* Use stemming to remove conceptual duplicates
* Show Wiktionary definitions
* Match based on Wiktionary prununciations
* Add in rhyming words by following Wiktionary links
