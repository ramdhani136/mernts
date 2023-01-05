import mongoose, { ConnectOptions } from "mongoose";
import WhatsAppBoot from "../utils/WhatsappBoot";
const { MongoStore } = require("wwebjs-mongo");

class DataConnect {
  public wa!: WhatsAppBoot;

  constructor() {
    this.connect();
  }
  protected connect(): void {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoose.set("strictQuery", false);
    mongoose
      .connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/expressts?authSource=admin`,
        options as ConnectOptions
      )
      .then(() => {
        // WhatsappBot service
        if (process.env.WABOT_ACTIVE==='true') {
          const store = new MongoStore({ mongoose: mongoose });
          this.wa = new WhatsAppBoot(store);
        }
      });

    const db = mongoose.connection;
    db.on("error", (error) => console.log(error));
    db.on("open", () => console.log("Database Connected"));
  }
}

export default DataConnect;