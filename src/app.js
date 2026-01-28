require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require('./routes/chat')
const cors = require("cors");
const http = require("http");
const {initSocket} = require("./utils/socket");
require("./utils/cron");

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",chatRouter);

connectDB()
  .then(() => {
    console.log("database connected");
    server.listen(7777, () => {
      console.log("server is running on 7777");
    });
  })
  .catch((err) => console.log("not connected", err));
