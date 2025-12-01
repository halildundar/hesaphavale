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
const AppendTableRow = (data) => {
  // let bakiye = parseFloat(data["depositAmount"]) - parseFloat(data["withdrawAmount"]);
  let activityDateTime = DateActivityToTableTime(data.activityDateTime);

  const strRand = Handlebars.compile(`
      <tr class="" data-ur="{{_id}}">
                    <td class="">
                        <div class="text-nowrap">{{activityDateTime}}</div>
                    </td>
                     <td class="">
                        <div class="text-nowrap">{{subReferenceKey}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap">{{branchName}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap">{{accountBankName}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap text-blue-500 font-medium">₺{{depositAmount}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap text-red-500  font-medium">₺{{withdrawAmount}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap text-orange-600 font-medium">₺{{balance}}</div>
                    </td>
                    <td class="">
                        <div class="text-nowrap font-medium text-purple-600">₺{{feeAmount}}(%{{feeRate}})</div>
                    </td>
                    
                   
                </tr>
    `);
  $(".mytable table tbody").prepend(strRand({ ...data, activityDateTime }));
};
const InitTable = (islemler) => {
  const popStrRand =
    Handlebars.compile(`<div class="popveri fixed top-0 left-0 right-0 bottom-0 bg-black/10 flex items-center justify-center z-[51]">
    <div class="bg-white rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] w-1/3 h-[90%] flex flex-col">
        <div class="pl-3 pr-2 py-1 flex items-center justify-between">
            <div class="text-[1.2rem] font-medium">Veri</div>
            <button class="btn-popvericls text-[1.2rem] bg-black/5 hover:bg-black/10 rounded-full p-2 tio">clear</button>
        </div>
        <div class="px-3 flex-1 overflow-y-auto">
            <table class="tbl-popveri">
                {{#each veri}}
                <tr>
                    <th class="text-start">{{@key}}</th>
                    <th class="w-[2rem]">:</th>
                    <td>{{this}}</td>
                </tr>
                {{/each}}
            </table>
        </div>
    </div>
</div>`);
  $(".mytable table tbody").html("");
  for (let i = islemler.length - 1; i >= 0; i--) {
    const islem = islemler[i];
    AppendTableRow(islem);
  }
  $(".spinner").hide();
  $(".mytable table tbody tr").on("click", function () {
    let _id = $(this).attr("data-ur");
    let findedIslem = islemler.find((a) => a._id === _id);
    $("body").append(popStrRand({ veri: findedIslem }));
    $(".popveri .btn-popvericls").on("click", function () {
      $(".popveri").remove();
    });
  });
};
const makeHesap = (items) => {
  let yatan = items.reduce(
    (acc, curr) => parseFloat(curr.depositAmount) + acc,
    0
  );
  let cekim = items.reduce(
    (acc, curr) => parseFloat(curr.withdrawAmount) + acc,
    0
  );
  let bakiye = items.reduce((acc, curr) => parseFloat(curr.balance) + acc, 0);
  console.log(items);
  $(".txt-islem").html(items.length);
  $(".txt-yatan").html(formatTL(yatan));
  $(".txt-cekim").html(formatTL(cekim));
  $(".txt-bakiye").html(formatTL(bakiye));
};
const IslemlerPage = (items, { type, data }) => {
  if (type === "insert") {
    items = [data, ...items];
    AppendTableRow(data);
  } else if (type === "delete") {
    const { _id } = data;
    items = items.filter((a) => a._id !== _id);
    $(`tr[data-ur='${_id}']`).remove();
  }
  makeHesap(items);
  return items;
};

const GetIslemlerWatch = async (range = "today", isendtime = true) => {
  let eventSource;
  let items;
  async function initWatch(range, isendtime, pagename = "islemler") {
    items = await GetIslemlerList(range, isendtime);
    InitTable(items);
    makeHesap(items);
    if (eventSource) {
      eventSource.close();
    }
    if (range === "today" || range === "thisWeek" || range === "thisMonth") {
      eventSource = new EventSource(
        `/api/get-islemler-watch?range=${range}&isendtime=${isendtime}`
      );

      let itemsEvent$ = fromEvent(eventSource, "message").pipe(
        map((e) => JSON.parse(e.data))
      );
      itemsEvent$.subscribe((result) => {
        const { type, data } = result;
        if (pagename === "islemler") {
          items = IslemlerPage(items, { type, data });
        }
      });
    }
    return items;
  }
  $(".btn").on("click", async function () {
    let range = $(this).attr("data-ur");
    $(".btn").removeClass("active");
    $(this).addClass("active");
    $(".spinner").show();
    setTimeout(async () => {
      items = await initWatch(range, isendtime);
    }, 300);
  });
  $(".btn-excel").on("click", function () {
    const headers = [
      "ŞUBE",
      "TARİH",
      "ŞUBE TRX",
      "A.T.REF",
      "BANKA/GÖNDERİM ŞEKLİ",
      "HESAP SAHİBİ",
      "IBAN/HES.NO",
      "GÖNDERİCİ/ALICI",
      "KULLANICI/TC NO",
      "YATAN",
      "ÇEKİLEN",
      "KOMİSYON",
      "BAKİYE",
      "ONAY TARİH",
      "ONAYLAYAN",
      "AÇIKLAMA",
      "GÖNDEREN AÇIKLAMA",
    ];
    let newItems = items.map((a) => {
      let newItem = {
        ŞUBE: a.branchName,
        TARİH: DateActivityToTableTime(a.sentDateTime),
        "ŞUBE TRX": a.ownerUserNo,
        "A.T.REF": a.subReferenceKey,
        "BANKA/GÖNDERİM ŞEKLİ": a.accountBankName,
        "HESAP SAHİBİ": a.accountHolder,
        "IBAN/HES.NO": a.accountIban,
        "GÖNDERİCİ/ALICI": a.ownerUserName,
        "KULLANICI/TC NO": a.ownerUserNo,
        YATAN: a.depositAmount,
        ÇEKİLEN: a.withdrawAmount,
        KOMİSYON: a.feeAmount,
        BAKİYE: a.balance,
        "ONAY TARİH": DateActivityToTableTime(a.activityDateTime),
        ONAYLAYAN: a.approvedName,
        AÇIKLAMA: a.adminDescription,
        "GÖNDEREN AÇIKLAMA": a.senderDescription,
      };
      return newItem;
    });

    // 2. JSON → Sheet
    const ws = XLSX.utils.json_to_sheet(newItems, { header: headers });
    // const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // 3. Workbook oluştur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sayfa1");

    // 4. Dosyayı indir
    XLSX.writeFile(wb, "rapor.xlsx");
  });
  // await initWatch("today", true);
  // $(`.btn[data-ur='${range}']`).trigger("click")
  $(`.btn[data-ur='${range}']`).trigger("click");
  window.addEventListener("beforeunload", () => {
    if (eventSource) eventSource.close();
  });
};
const GetIslemlerList = async (range = "today", isendtime = true) => {
  let relurl = `/api/get-islemler-list?range=${range}&isendtime=${isendtime}`;
  const result = await $.ajax({
    type: "GET",
    url: relurl,
    dataType: "json",
  });
  return result;
};

export default async function () {
  GetIslemlerWatch("today", true);
}
