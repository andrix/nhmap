nhmap
=====

Restaurants map on Manhattan with contextual information from Wikipedia.
Simple app for Udacity project.

Requirements
------------

* node
* npm
* gulp
* bower

Bower deps:
- Bootstrap
- KnockoutJS
- JQuery

Gulp
- gulp-concat
- main-bower-files
- gulp-uglify
- gulp-clean-css (for CSS)
- gulp-rename
- gulp-html-replace
- gulp-debug

Details
-------

* all sources live in src/ folder
* gulp build is created in a "dist" folder


Bulding the project
-------------------

* Install node.js and npm on your computer: https://docs.npmjs.com/getting-started/installing-node
* Install gulp: 

    $ npm install gulp

* Install bower

    $ npm install bower

* Install gulp plugins (see above)

    $ npm install gulp-* --save-dev # for each plugin 

* Install bower components (see above)

    $ bower install knockoutjs --save
    $ bower install jquery --save
    $ bower install bootstrap --save

* After everything is installed, build the project running:

    $ gulp


Run the project
---------------

By default it connects to port: 8050. If you're already using that port, make sure to change it on
gulpfile.js to another port.

    $ gulp serve-prod


