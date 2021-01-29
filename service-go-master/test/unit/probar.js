var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../../src/models/user.model')
var Booking = require('../../src/models/booking.model')
var Profile = require('../../src/models/profile.model')

var expect = chai.expect;

chai.use(chaiHttp);

const mongoose = require("mongoose");


var data = {
    email : "luckylau123@gmail.com",
    password : "luckylau123",
    id:  "5da82cf2a4d4c00004a3c2925d2d",
    status: "Not Started;"
}

var should = chai.should();
describe("Progress bar", function(){
    it("It should retrieve the data from database", done => {
        chai.request('http://service-go.herokuapp.com').post("/login").send(data).end((err, res) => {
           
        }), 
        chai.request('http://service-go.herokuapp.com').get("/user/bookingDetails").end((err, res) => {
            res.body.should.be.a('object');
            expect(res.status).to.not.be.undefined;
              done();
    })
  })
})
