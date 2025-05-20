const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

const db = require("../db");

describe("predictRouter", () => {
  let request = chai.request(app);
  // before(async () => {
  //   request = chai.request(app).keepOpen();
  //   await db.migrate
  //     .forceFreeMigrationsLock()
  //     .then(() => db.migrate.rollback({ all: true }))
  //     .then(() => db.migrate.latest())
  //     .catch(console.error);
  // });

  // after(() => {
  //   request.close();
  // });

  describe("fetch yahoo finance", () => {
    it("should return status 200", async () => {
      const response = await request.get("/api/predict");
      expect(response).to.have.status(200);
    });

    // it("should have expected props", async () => {
    //   const products = await productModel.all();

    //   products.forEach((product) => {
    //     expect(product).to.exist;
    //     expect(product).to.have.property("id");
    //     expect(product).to.have.property("name");
    //     expect(product).to.have.property("stock");
    //     expect(product).to.have.property("cost_price");
    //     expect(product).to.have.property("sell_price");
    //   });
    // });

    // it("should accept a limit argument", async () => {
    //   const products = await productModel.all(3);
    //   expect(products.length).to.be.at.most(3);
    // });
  });
});
