var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../../src/models/user.model');
var Booking = require('../../src/models/booking.model');
var Profile = require('../../src/models/profile.model');
var expect = chai.expect;
chai.use(chaiHttp);
const mongoose = require('mongoose');
var should = chai.should();
//data to use in login
var data = {
  email: 'yantolie41@gmail.com',
  password: '12345'
};
//This function will test if the system can get the data from database and the data is defined
describe('Booking History', function() {
  it('It should retrieve the data from database', done => {
    chai
      .request('http://service-go.herokuapp.com')
      .post('/login')
      .send(data)
      .end((err, res) => {}),
      chai
        .request('http://service-go.herokuapp.com')
        .get('/user/history')
        .end((err, res) => {
          res.body.should.be.a('object');
          expect(res.type).to.not.be.undefined;
          done(); //This is added
        });
  });
});
