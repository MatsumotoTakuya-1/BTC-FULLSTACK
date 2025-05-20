const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

// const db = require("../db");

describe("predictRouter", () => {
  let request;
  before(() => {
    request = chai.request(app).keepOpen();
    // await db.migrate
    //   .forceFreeMigrationsLock()
    //   .then(() => db.migrate.rollback({ all: true }))
    //   .then(() => db.migrate.latest())
    //   .catch(console.error);
  });

  after(() => {
    request.close();
  });

  // describe("fetch yahoo finance", () => {
  it("should return status 200", async () => {
    const response = await request
      .post("/api/predict")
      .send({ symbol: AAPL, range: "1w", model: "model1" });

    expect(response).to.have.status(200);
  });

  // });
});
