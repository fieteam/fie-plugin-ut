const chai = require('chai');
const sinon = require('sinon');
const request = require('supertest');

global.should = chai.should();
global.expect = chai.expect;
global.sinon = sinon;
global.request = request;

