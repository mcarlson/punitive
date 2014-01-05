## Punitive pun finder

### Prerequisite

[Node.js v0.10.x](http://nodejs.org/download/)

Install dependencies:
    npm install

### Rebuilding the index

Download a dump of all wiktionary articles in english, e.g. http://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2:
    wget http://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2

Next, index it. This will take a while:
    bzip2 -dc pages-articles.xml.bz2 | node indexer.js


### Finding puns

Run punitive.js, then type words interactively at the prompt:
    node punitive.js
