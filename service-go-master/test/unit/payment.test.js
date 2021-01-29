var chai = require("chai");
var chaiHttp = require("chai-http");
var Payment = require("../../src/models/payment.model");
var User = require("../../src/models/user.model");

var expect = chai.expect;

chai.use(chaiHttp);

const mongoose = require("mongoose");

var data = {
  _id: "5da69db9d977e903b840ee02",
  customerEmail: "luitelpramish7@gmail.com",
  email: "luitelpramish7@hotmail.com",
  password: "hellopramish"
};

var should = chai.should();

describe("Payment History", () => {
  it("It should get the data from database", done => {
    chai
      .request("http://service-go.herokuapp.com")
      .post("/login")
      .send(data),
      chai
        .request("http://service-go.herokuapp.com")
        .get("/user/payment")
        .end((err, res) => {
          res.body.should.be.a("object");
          expect(res.type).to.not.be.undefined;
          done();
        });
  });
});
