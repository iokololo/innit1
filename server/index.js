import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./db.js";
import Models from "./models/index.js";
import routers from "./router/index.js";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { ComponentLoader } from "adminjs";
import { locale } from "./loaclizationAdminJS.js";
import TelegramBot from "node-telegram-bot-api";

dotenv.config({
  path: process.env.NODE_ENV == "development" ? ".env.dev" : ".env.prod",
});

const componentLoader = new ComponentLoader();
const PORT = process.env.PORT || 8080;


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", routers.AuthRouter);
app.use("/product", routers.ProductRouter);
app.use("/settings", routers.SettingsRouter);
app.use("/payment", routers.PaymentRouter);
app.use("/lot", routers.LotContactFormRouter);
app.use("/authors", routers.AuthorRouter);
app.use("/chat", routers.AIRouter);
app.use("/reviews", routers.ReviewRouter)



const InitTelegramBot = async () => {
  try {
    console.log("Telegram bot init");
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_API, {
      polling: true,
    });

    return bot;
  } catch (e) {
    console.log("Telegram bot error");
    console.log(e);
  }
};

export const startAdmin = async () => {
  const Components = {
    Dashboard: componentLoader.add("Dashboard", "./admin/dashboard")
  };

  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });

  const adminOptions = {
    resources: [
      ...Object.values(Models).map((model) => ({
        resource: model,
      })),
    ],
    locale,
  };

  const admin = new AdminJS({
    ...adminOptions,
    componentLoader,
    dashboard: {
      component: Components.Dashboard,
    },
    rootPath: "/admin",
  });

  const adminRouter = AdminJSExpress.buildRouter(
    admin
  );

  app.use(admin.options.rootPath, adminRouter);
  return admin;
};


export const TGBot = await InitTelegramBot();
const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  await startAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
