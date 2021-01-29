//Libraries for testing framework
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

//Data for getting the payment from database.
var data = {
  _id: '5da69db9d977e903b840ee02',
  customerEmail: 'luitelpramish7@gmail.com',
  email: 'luitelpramish7@hotmail.com',
  password: 'hellopramish'
};

//Need to declare should before starting the chai()
var should = chai.should();

describe('Payment History', () => {
  // Describe what to test
  it('It should get the data from database', done => {
    // It must be declared before starting the testing
    chai
      .request('http://service-go.herokuapp.com') //url for the application
      .post('/login')
      .send(data)
      .end((err, res) => {}),
      chai
        .request('http://service-go.herokuapp.com') //url for the application
        .get('/user/payment')
        .end((err, res) => {
          res.body.should.be.a('object');
          expect(res.type).to.not.be.undefined;
          done();
        });
  });
});
