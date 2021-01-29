const app = require("../../src/server");

const mongoose = require("mongoose");
const chaiHttp = require("chai-http");
const chai = require("chai");
let should = chai.should();
chai.use(chaiHttp);

describe("/GET all categories", () => {
  it("it should GET all the categories", done => {
    chai
      .request(app)
      .get("/search-category")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a("object");
        res.body.should.be.a("array");
        // Checks if the body contains a key called type
        res.body[0].should.have.property("type");
        res.body[0].should.have.property("demand");

        done();
      });
  });

  it("it should GET the location of the user", done => {
    let id = "5d860fe187b2ce04b3bd3dcb";
    chai
      .request(app)
      .get(`/user/getLocation/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("address");
        done();
      });
  });
});
