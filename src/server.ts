import "reflect-metadata"
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { UserRouter } from "./user/user.router";
import { ConfigServer } from "./config/config";
import { PurchaseRouter } from "./purchase/purchase.router";
import { PurchaseProductRouter } from "./purchase/purchase-product.route";
import { ProductRoute } from "./product/product.route";
import { CustomerRouter } from "./customer/customer.router";
import { CategoryRouter } from "./category/category.route";
import { DataSource } from "typeorm";

class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.dbConnect()
    this.app.use(morgan("dev"));
    this.app.use(cors());

    this.app.use("/api", this.routers());

    this.listen();
  }

  routers(): Array<express.Router> {
    return [
      new UserRouter().router,
      new PurchaseRouter().router,
      new PurchaseProductRouter().router,
      new ProductRoute().router,
      new CustomerRouter().router,
      new CategoryRouter().router,
    ];
  }
  async dbConnect(): Promise<DataSource | void> {
    return this.initConnect
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => console.error(err));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log("Server listening on port: " + this.port);
    });
  }
}

new ServerBootstrap();
