Notice
-----------------


Table of Contents
-----------------


Features
--------
	- Account Management + social network data
	- Provider management (CRUD on provider data)
	- 


Prerequisites
-------------

	- [MongoDB](http://www.mongodb.org/downloads)
	- [Node.js](http://nodejs.org) 
	- Express
	- Command Line Tools
	- Backbone , Marionette
	- Bootstrap 3
	- CSRF protection

Getting Started
---------------

	$ git clone --depth=1 https://github.com/pchomphoosang/dentalpoint_v0.1.git myproject
	$ cd myproject
	$ git remote rm origin

	# Install NPM dependencies
	$ npm install

	# run the program
	$ node app.js
	or nodemon app.js

Deplyment 
---------------

	Download and install Heroku Toolbelt
	In terminal, run 
	heroku login 
	heroku create
	heroku addons:add mongolab 
	git push heroku master. 

	Open mongolab.com website (pawat,pawat)
	in secrets.js instead of db: 'localhost', use the following URI with your credentials:
	db: 'mongodb://USERNAME:PASSWORD@ds027479.mongolab.com:27479/DATABASE_NAME'


