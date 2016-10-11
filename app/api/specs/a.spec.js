(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('Init', function() {

	/* jshint node: true */
	var mongoose = require('mongoose');
	var autoIncrement = require('mongoose-auto-increment');
	autoIncrement.initialize(mongoose.connection);

		it('should set mongoose autoIncrement', function() {
			//This just to set autoincrement before all files
		});
});
}());

