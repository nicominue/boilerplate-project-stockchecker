const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

const server = require("../server");

suite("Functional Tests", function () {

  test("Viewing one stock: GET /api/stock-prices/", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.equal(res.body.stockData.stock, "GOOG");
        done();
      });
  });

  test("Viewing one stock and liking it", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "AAPL", like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing the same stock and liking it again", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "AAPL", like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing two stocks", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.property(res.body.stockData[0], "rel_likes");
        assert.property(res.body.stockData[1], "rel_likes");
        done();
      });
  });

  test("Viewing two stocks and liking them", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"], like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        done();
      });
  });

});

