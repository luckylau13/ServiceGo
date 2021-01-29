var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

describe("View profile of service provider", function () {
    it("It should load profile page correctly!", done => {
        chai.request('http://service-go.herokuapp.com/').get("/user/Pramish/profile").end((err, res) => {
            res.body.should.be.a('object');
            expect(res.text).to.include("Pramish Luitel");
            expect(res.text).to.include("luitelpramish7@gmail.com");
        });
        done();
    })
})
