import { config } from "dotenv";
config({ path: ["const.env"] });
import express from "express";
import { engine } from "express-handlebars";
import {
  list,
  calc,
  IsEq,
  BiggerThan,
  LessThan,
  Inc,
  Json,
  DigitFract,
} from "./genel/helpers.js";
import {MainRoutes} from "./routes.js";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cors from "cors";
const app = express();
app.use(cors({ origin: true }));
let PORT = process.env.PORT || 3000;

app.use(compression());
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 86400000 1 day
    },
  })
);
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: process.cwd() + "/views/layouts",
    partialsDir: [process.cwd() + "/views/partials"],
    helpers: { calc, list, IsEq, BiggerThan, LessThan, Inc, Json, DigitFract },
  })
);
app.set("view engine", ".hbs");
app.set("views", `${process.cwd()}/views`);

app.use(express.static("dist"));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.text({ limit: "100mb" }));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
MainRoutes(app);


app.listen(PORT, () => {
  console.log(`Server is starting at ${PORT}`);
});
