import "./main.scss";
import "./jqform-serialize.js";
import PersonelInit from "./pages/personel.js";
import YmsFirmalarInit from "./pages/ymsfirmalar.js";
import TartikullaniciInit from "./pages/tartikullanicilar.js";
import TartialetleriInit from "./pages/tartialetleri.js";
import MuayenelerInit from "./pages/muayeneler.js";
import VeriInit from "./pages/veri.js";
import DashboardInit from "./pages/dashboard.js";
import IslemlerInit from "./pages/islemler.js";
export const HOST_NAME = location.origin; //"http://localhost:3000";
// export const HOST_NAME = "http://localhost:3000" //"https://crazy-noyce.89-250-72-218.plesk.page";
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
Handlebars.registerHelper("IsEq", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
Handlebars.registerHelper("DigitFract", function (value, fractDigit) {
  return value.toFixed(fractDigit);
});
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
Handlebars.registerHelper("ObjectVal", function (ObectData, key) {
  return ObectData[key];
});

const sendForm = async () => {
  console.log($("form"));
  const data = $("form").serializeJSON();

  try {
    const result = await $.ajax({
      type: "post",
      url: "/users",
      data: { ...data },
      dataType: "json",
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
const getUsers = async () => {
  return $.ajax({
    type: "GET",
    url: "/users",
    dataType: "JSON",
  });
};
$(async function () {
  let pathname = this.location.pathname;
  if (pathname === "/") {
    DashboardInit()
    // const { fromEvent } = rxjs;
    // const { map } = rxjs.operators;
    // $(".btn-sm").on("click", async function () {
    //   sendForm();
    // });
    // const eventSource = new EventSource("/users/sse");

    // const users$ = fromEvent(eventSource, "message").pipe(
    //   map((e) => JSON.parse(e.data))
    // );

    // const log = document.getElementById("log");
    // users$.subscribe((msg) => {
    //   console.log(msg);
    //   const li = document.createElement("li");
    //   li.className = msg.type;
    //   li.textContent = `${msg.type.toUpperCase()} → ${JSON.stringify(
    //     msg.data
    //   )}`;
    //   log.prepend(li);
    // });
    // let users = await getUsers();
    // for (let index = 0; index < users.length; index++) {
    //   const user = users[index];
    //   const li = document.createElement("li");
    //   li.textContent = JSON.stringify(user);
    //   log.prepend(li);
    // }
  } else if (pathname === "/islemler") {
    IslemlerInit();
  } else if (pathname === "/ctrlpanel/personel") {
    PersonelInit();
  } else if (pathname === "/ctrlpanel/muayeneler") {
    MuayenelerInit();
  } else if (pathname === "/ctrlpanel/tartikullanici") {
    TartikullaniciInit();
  } else if (pathname === "/superpanel/ymsfirmalar") {
    YmsFirmalarInit();
  }else if(pathname === "/ctrlpanel/tartialetler"){
    TartialetleriInit();
  }else if(pathname === "/ctrlpanel/veri"){
    VeriInit();
  }

  $("body").css("overflow", "auto");
  $(".spinnerpop").css("display", "none");
});
