import { fromEvent } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  filter,
} from "rxjs/operators";
const searchInput = (selector) => {
  let inputEl = $(selector);
  let keyupObs = fromEvent(inputEl, "keyup").pipe(
    map((e) => e.target.value.trim()),
    debounceTime(400),
    distinctUntilChanged(),
    filter((text) => text.length === 0 || text.length > 3)
  );
  // Enter ile manuel arama
  let enterObs = fromEvent(inputEl, "keydown").pipe(
    filter((e) => e.key === "Enter"),
    map(() => inputEl.val().trim())
  );
  return { keyupObs, enterObs };
};

const MakeTumVeriTable = (tumVeri, search = "") => {
  if (search !== "") {
    tumVeri = tumVeri.filter((a) => {
      let itemjson = JSON.stringify(a).toLocaleLowerCase();
      return itemjson.includes(search.toLocaleLowerCase());
    });
  }
  if (tumVeri.length !== 0) {
    const tableHeaders = Object.keys(tumVeri[0]);
    let headerStr = Handlebars.compile(`
    <table class="border-collopse w-full text-[0.8rem]">
                <thead>
                    <tr>
                        {{#each headernames}}
                        <th class="text-nowrap text-start py-1 sticky top-0 bg-white px-1 border-b border-gray-200">{{this}}</th>
                        {{/each}}
                    </tr>
                 
                </thead>
                <tbody>

                </tbody>
            </table>`);
    $(".listtoparea").html(headerStr({ headernames: tableHeaders }));
    const tableStr = Handlebars.compile(`
    {{#each tumVeri}}
     <tr class="group" data-ur="{{#ObjectVal this 'Muay.Seri No'}}{{/ObjectVal}}">
        {{#each ../headernames}}
          <td class="group-hover:bg-black/10 cursor-default text-start px-2 py-1 text-nowrap border-b border-gray-200">{{#ObjectVal ../this this}}{{/ObjectVal}}</td>
        {{/each}}
    </tr>
     {{/each}}
    `);
    $(".listtoparea tbody").html(
      tableStr({ headernames: tableHeaders, tumVeri: tumVeri })
    );
    $(".listtoparea tbody tr").on("click", function (e) {
      e.stopPropagation();
      $(".lftpanel").show();
      $(".itemarea").removeClass("col-span-6").addClass("col-span-4");
      $(".listtoparea tbody tr").css("background-color", "transparent");
      $(this).css("background-color", "rgba(0,0,0,0.2)");
      let muay_serino = $(this).attr("data-ur");
      let findedMuay = tumVeri.find((a) => a["Muay.Seri No"] === muay_serino);
      console.log(findedMuay);
      let newItemsMuay = {
        "Talep No": findedMuay["Talep No"],
        "Muay.Seri No": findedMuay["Muay.Seri No"],
        "Başv.Tarih": findedMuay["Başv.Tarih"],
        "Başvr.Sahibi": findedMuay["Başvr.Sahibi"],
        "Yetkili Kişi": findedMuay["Yetkili Kişi"],
        "Muay.Personel": findedMuay["Muay.Personel"],
        "Muay.Tarih": findedMuay["Muay.Tarih"],
        "TC/Vergi No": findedMuay["TC/Vergi No"],
        "Firma Adı": findedMuay["Firma Adı"],
        Email: findedMuay["Email"],
        Telefon: findedMuay["Telefon"],
        Adres: (
          findedMuay["Mahalle"] +
          " Mah." +
          findedMuay["Adres"] +
          " " +
          findedMuay["İlçe"] +
          "/" +
          findedMuay["İl"]
        ).toLocaleUpperCase(),
        "Marka/Model": findedMuay["Marka/Model"],
        Serino: findedMuay["Serino"],
        "İmal yılı": findedMuay["İmal yılı"],
        Tip: findedMuay["Tip"],
        Sınıf: findedMuay["Sınıf"],
        "Kapasite(w1)": `${findedMuay["Kapasite(w1)"]}${findedMuay["Kapasite Birim(w1)"]}-${findedMuay["e(w1)"]}/${findedMuay["d(w1)"]}`,
        "Kapasite(w2)": `${findedMuay["Kapasite(w2)"]}${findedMuay["Kapasite Birim(w2)"]}-${findedMuay["e(w2)"]}/${findedMuay["d(w2)"]}`,
        "Kapasite(w3)": `${findedMuay["Kapasite(w3)"]}${findedMuay["Kapasite Birim(w3)"]}-${findedMuay["e(w3)"]}/${findedMuay["d(w3)"]}`,
      };
      let mauyeneKeys = [
        { db_name: "", xlsxname: "Talep No" },
        { db_name: "", xlsxname: "Muay.Seri No" },
        { db_name: "", xlsxname: "Başv.Tarih" },
        { db_name: "", xlsxname: "Başvr.Sahibi" },
        { db_name: "", xlsxname: "Muay.Personel" },
        { db_name: "", xlsxname: "Muay.Tarih" },
        { db_name: "", xlsxname: "TC/Vergi No" },
        { db_name: "", xlsxname: "Firma Adı" },
        { db_name: "", xlsxname: "Firma Tam Unvan" },
        { db_name: "", xlsxname: "Email" },
        { db_name: "", xlsxname: "İl" },
        { db_name: "", xlsxname: "İlçe" },
        { db_name: "", xlsxname: "Mahalle" },
        { db_name: "", xlsxname: "Adres" },
        { db_name: "", xlsxname: "Marka/Model" },
        { db_name: "", xlsxname: "Serino" },
        { db_name: "", xlsxname: "İmal yılı" },
        { db_name: "", xlsxname: "Tip" },
        { db_name: "", xlsxname: "Sınıf" },
        { db_name: "", xlsxname: "Kapasite Birim(w1)" },
        { db_name: "", xlsxname: "Kapasite(w1)" },
        { db_name: "", xlsxname: "e(w1)" },
        { db_name: "", xlsxname: "d(w1)" },
        { db_name: "", xlsxname: "Kapasite Birim(w2)" },
        { db_name: "", xlsxname: "Kapasite(w2)" },
        { db_name: "", xlsxname: "e(w2)" },
        { db_name: "", xlsxname: "d(w2)" },
        { db_name: "", xlsxname: "Kapasite Birim(w3)" },
        { db_name: "", xlsxname: "Kapasite(w3)" },
        { db_name: "", xlsxname: "e(w3)" },
        { db_name: "", xlsxname: "d(w3)" },
      ];
      let tableAreaStr = Handlebars.compile(`
        <table class="w-full border-collapse text-[0.8rem]">
         {{#each headernames}} 
          <tr>
              <th class="text-start w-1/3">{{this}}</th>
              <td class="w-2/3">{{#ObjectVal ../data this}}{{/ObjectVal}}</td>
          </tr>
          {{/each}}
        </table>
      `);
      $(".lftpanel .formarea").html(
        tableAreaStr({
          headernames: Object.keys(newItemsMuay),
          data: newItemsMuay,
        })
      );
      console.log(muay_serino);
    });
  } else {
    $(".listtoparea").html(`
        <div class="text-center py-10 font-bold text-black/50 text-[1.2rem]">Veri yok</div>
      `);
  }
};
const MakeDbdata = (tumVeri) => {
  console.log(tumVeri);
  let firmaList = Array.from(
    new Map(tumVeri.map((p) => [p["Firma Adı"], p])).values()
  );
  firmaList = firmaList.sort((a, b) =>
    a["Firma Adı"] < b["Firma Adı"] ? -1 : 1
  );
  let newFirmalist = firmaList.map((a) => {
    let gercek_tuzel = a["TC/Vergi No"].length === 11 ? "Gerçek" : "Tüzel";
    let item = {
      gercek_tuzel: gercek_tuzel,
      il: a["İl"],
      ilce: a["İlçe"],
      mahale: a["Mahalle"],
      pk: "-",
      adres: a["Adres"],
      yetkil_kisi: ["Yetkili Kişi"],
      telefon: a["Telefon"],
      email: a["Email"],
      status: "Aktif",
    };
    if (gercek_tuzel === "Tüzel") {
      item["vergi_no"] = a["TC/Vergi No"];
      item["kisa_ad"] = a["Firma Tam Unvan"];
      item["unvan"] = a["unvan"];
    } else if (gercek_tuzel === "Gerçek") {
      item["tc"] = a["TC/Vergi No"];
      item["ad_soyad"] = a["Firma Tam Unvan"];
    }
    return item;
  });
  console.log(newFirmalist);
  let tartiAletler = Array.from(
    new Map(tumVeri.map((p) => [p["Serino"], p])).values()
  );
  let newTartiAletleri = tartiAletler.map((a) => {
    let taksimat = [];
    if (!!a["Kapasite(w1)"]) {
      taksimat.push({
        kapasite: $.trim(a["Kapasite(w1)"]),
        birim: $.trim(a["Kapasite Birim(w1)"]),
        e_sabit: $.trim(a["d(w1)"]),
        d_taks_ara: $.trim(a["d(w1)"]),
      });
    }
    if (!!a["Kapasite(w2)"]) {
      taksimat.push({
        kapasite: $.trim(a["Kapasite(w2)"]),
        birim: $.trim(a["Kapasite Birim(w2)"]),
        e_sabit: $.trim(a["d(w2)"]),
        d_taks_ara: $.trim(a["d(w2)"]),
      });
    }
    if (!!a["Kapasite(w3)"]) {
      taksimat.push({
        kapasite:$.trim(a["Kapasite(w3)"]),
        birim:$.trim(a["Kapasite Birim(w3)"]),
        e_sabit:$.trim(a["d(w3)"]),
        d_taks_ara:$.trim(a["d(w3)"]),
      })
    }
    let item = {
      tar_kul_id: "",
      tar_kul_name:a["Firma Adı"],
      marka_model: a["Marka/Model"],
      seri_no: a["Serino"],
      imal_yili: a["İmal yılı"],
      tip: a["Tip"],
      taksimat_adet: taksimat.length,
      taksimat: taksimat,
      status: "Aktif",
    };
    return item;
  });
   console.log(newTartiAletleri);

  let muay_pers = Array.from(
    new Map(tumVeri.map((p) => [p["Muay.Personel"], p])).values()
  );
  let newMuayPers = muay_pers.map(a=>{
    return {
      tc:"",
      name:$.trim(a["Muay.Personel"]),
      telefon:"",
      email:"",
      status:"Aktif"
    }
  });
  console.log(newMuayPers);
};
export default Initfnc = async () => {
  console.log("veri area");
  $(".lftpanel").on("click", function (e) {
    e.stopPropagation();
  });
  $(".itemarea").on("click", function (e) {
    e.stopPropagation();
  });
  $(".btn-temizle").on("click", function () {
    $(".lftpanel").hide();
    $(".itemarea").addClass("col-span-6").removeClass("col-span-4");
    $(".listtoparea tbody tr").css("background-color", "transparent");
  });
  
  let tumVeri;
  $(".btn-dosya-sec").on("click", function () {
    $("#file-select").val("");
    $("#file-select").trigger("click");
  });
  $("#file-select").on("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // İlk iki sayfayı al
      const sheetData = workbook.Sheets[workbook.SheetNames[0]];
      // JSON'a dönüştür
      tumVeri = XLSX.utils.sheet_to_json(sheetData, {
        defval: "",
      });
      MakeTumVeriTable(tumVeri);
      MakeDbdata(tumVeri);
      $(".btn-dosya-sec").html(`Dosya: ${file.name}`);
    };
    reader.readAsArrayBuffer(file);
  });

  const { keyupObs, enterObs } = searchInput("#search");

  keyupObs.subscribe((val) => {
    if (!!tumVeri && tumVeri.length > 0) {
      MakeTumVeriTable(tumVeri, val);
    }
  });
  enterObs.subscribe((val) => {
    if (!!tumVeri && tumVeri.length > 0) {
      MakeTumVeriTable(tumVeri, val);
    }
  });
};
