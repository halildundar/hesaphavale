import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import { formatTL } from "./util/formatTL.js";
function to2Digit(n) {
  return n.toString().padStart(2, "0");
}

export const DateActivityToTableTime = (activityDateTime) => {
  let date = new Date(activityDateTime);
  return `${to2Digit(date.getDate())}.${to2Digit(
    date.getMonth() + 1
  )}.${date.getFullYear()} ${to2Digit(date.getHours())}:${to2Digit(
    date.getMinutes()
  )}:${to2Digit(date.getSeconds())}`;
};
const GetKasalar = async (range, isendtime = true) => {
  return await $.ajax({
    type: "GET",
    url: `/api/get-total?range=${range}&isendtime=${isendtime}`,
    dataType: "json",
  });
};
const MakeTables = (kasalar) => {
  let kasaStrRand = Handlebars.compile(`<a href="/" class="panel relative">
            <div class="pb-4 flex items-center space-x-4">
                <div
                    class="w-[50px] h-[50px] text-[2rem] text-bold {{lowbgcolor}} {{textcolor}} flex items-center justify-center rounded-full">
                    {{firstletter}}
                </div>
                <div>
                    <div class="font-medium 2xl:text-[1.2rem]">{{name}}</div>
                    <div class="text-[0.8rem] 2xl:text-[0.9rem] text-gray-700">
                        İşlem Sayısı: <span>{{transactionCount}}</span></div>
                </div>
            </div>
            <div>
                <table class="w-full text-[0.9rem] 2xl:text-[1rem]">
                    <tr class="w-1/2 text-gray-500">
                        <td>Komisyon</td>
                        <th class="{{textcolor}}  text-start">%{{feeRate}}</th>
                        <th class="{{textcolor}}  text-start">₺{{totalFee}}</th>
                    </tr>
                    <tr class="w-1/2 text-gray-500">
                           <td>Yatırım</td>
                              <td>Çekim</td>
                        <td >Toplam Tutar</td>
                    </tr>
                    <tr class="w-1/2 font-normal">
                        <th class="text-start text-orange-500">{{totalDeposit}}</th>
                          <th class="text-start text-red-500">{{totalWithdraw}}</th>
                        <th class="text-start" >₺{{totalBalance}}</th>
                    </tr>
                </table>
            </div>
            <div
                class="absolute font-medium top-2 right-2 {{bgcolor}} text-white rounded text-[0.8rem] px-2 py-1 leading-tight">
                {{type}}
            </div>
        </a>`);

  kasalar = kasalar.sort((a, b) =>
    a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
  );
  $(".grdarea").html("");
  for (let i = 0; i < kasalar.length; i++) {
    let kasa = kasalar[i];
    kasa["firstletter"] = kasa.name[0];
    kasa["totalBalance"] = formatTL(kasa.totalBalance);
    kasa["totalDeposit"] = formatTL(kasa.totalDeposit);
    kasa["totalFee"] = formatTL(kasa.totalFee);
    kasa["totalWithdraw"] = formatTL(kasa.totalWithdraw);
    if (kasa.type === "Tedarikçi") {
      kasa["textcolor"] = "text-green-600";
      kasa["bgcolor"] = "bg-green-600";
      kasa["lowbgcolor"] = "bg-green-200";
    } else {
      kasa["textcolor"] = "text-blue-600";
      kasa["bgcolor"] = "bg-blue-600";
      kasa["lowbgcolor"] = "bg-blue-200";
    }
    $(".grdarea").append(kasaStrRand({ ...kasa }));
  }
};
const WatchTime = () => {
  let eventSource = new EventSource("/api/watch");
  let src$ = fromEvent(eventSource, "message").pipe(
    map((e) => JSON.parse(e.data))
  );
  src$.subscribe((result) => {
    console.log(result)
    const { type, data } = result;
    let stringTime = "Err";
    if (!!data && !!data.time) {
      let d = new Date(data.time);

      let pad = (n) => ("0" + n).slice(-2);

      stringTime =
        pad(d.getDate()) +
        "." +
        pad(d.getMonth() + 1) +
        "." +
        d.getFullYear() +
        " " +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes()) +
        ":" +
        pad(d.getSeconds());
    }
    if(!!type){
      $(".refresh-time").html(stringTime);
    }
   
  });
};
export default async function () {
  // GetIslemlerWatch("today", true);
  console.log("kasalar");
  $(".btn").on("click", async function () {
    $(".spinner").show();
    $(".yokarea").hide();
    $(".grdarea").hide();
    let range = $(this).attr("data-ur");
    $(".btn").removeClass("active");
    $(this).addClass("active");
    $(".spinner").show();
    setTimeout(async () => {
      kasalar = await GetKasalar(range);
      // console.log(kasalar);
      if (kasalar.length > 0) {
        $(".grdarea").show();
        $(".spinner").hide();
        $(".yokarea").hide();
        MakeTables(kasalar);
      } else if (kasalar.length === 0) {
        $(".spinner").hide();
        $(".yokarea").show();
      } else {
        $(".spinner").hide();
        $(".yokarea").hide();
      }
    }, 300);
  });
  $(`.btn[data-ur='today']`).trigger("click");
  WatchTime();
}
