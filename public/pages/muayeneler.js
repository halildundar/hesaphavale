import { fromEvent } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Validator } from "./util/validator.js";
let relurl = "/ctrlpanel/muayeneler";
export default Initfnc = async () => {
  console.log("Muayene Personel");

  formSet();
  watchItems();
  let denetciler = await GetDenetciler();

  $(".btn-save").on("click", async function () {
    let formData = $(".genelbilgipanel").serializeJSON();
    let isValid = Validator(formData, "genelbilgipanel");
    if (isValid) {
      let selectedDenetci = denetciler.find(
        (a) => a._id === $("#pers_id").val()
      );
      let result = await saveItem(formData);
    }
  });
  $(".btn-update").on("click", async function () {
    let formData = $(".genelbilgipanel").serializeJSON();
    let isValid = Validator(formData, "genelbilgipanel");
    if (isValid) {
      let _id = $(".btn-update").attr("data-ur");
      let result = await updateFullItem(_id, formData);
    }
  });
  $(".btn-delete").on("click", async function () {
    let _id = $(this).attr("data-ur");
    if (!!_id) {
      let result = await deleteItem(_id);
    }
  });

  TartiAletSec();
};

const formSet = async (data) => {
  if (!data) {
    $(".genelbilgipanel")[0].reset();
    return;
  }
  const allowed = [
    "mua_tarih",
    "next_mua_tarih",
    "pers_id",
    "modul",
    "tar_alet_id",
  ];

  const filtered = Object.keys(data)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
  for (const key in filtered) {
    $(`.genelbilgipanel [name='${key}']`).val(filtered[key]);
  }
  let strSelctAreaColsRand =
    Handlebars.compile(`<tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Tart.Kull</th>
                            <th class="w-[10px]">:</th>
                            <td>{{kisa_ad}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Marka</th>
                            <th class="w-[10px]">:</th>
                            <td>{{marka_model}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Sınıf</th>
                            <th class="w-[10px]">:</th>
                            <td>{{sinif}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Taksimat</th>
                            <th class="w-[10px]">:</th>
                            <td>
                            {{#each taksimat}}
                {{kapasite}}{{#if @last}} {{else}}<span class="pl-1">/</span>{{/if}}
              {{/each}}
                            </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">İmal Yılı</th>
                            <th class="w-[10px]">:</th>
                            <td>{{imal_yili}}</td>
                        </tr>
                         <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Tip</th>
                            <th class="w-[10px]">:</th>
                            <td>{{tip}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Durum</th>
                            <th class="w-[10px]">:</th>
                            <td>{{status}}</td>
                        </tr>`);
  $(".slctd-area table").html(
    strSelctAreaColsRand({
      _id: data._id,
      kisa_ad:
        data.tartikullanici.gercek_tuzel === "Tüzel"
          ? data.tartikullanici.kisa_ad
          : data.tartikullanici.ad_soyad,
      pers_name: data.personel.name,
      marka_model: data.tartialet.marka_model,
      imal_yili: data.tartialet.imal_yili,
      sinif: data.tartialet.sinif,
      tip: data.tartialet.tip,
      taksimat: data.tartialet.taksimat,
      status: data.tartialet.status,
      mua_tarih: data.mua_tarih,
      next_mua_tarih: data.next_mua_tarih,
    })
  );
  return;
};
const watchItems = async () => {
  $("body").on("click", function () {
    $(".itemrow").removeClass("font-bold text-green-600");
    $(".itemrow .status").removeClass("text-green-600");
    $(".btn-update").hide();
    $(".btn-delete").hide();
    $(".btn-update").removeAttr("data-ur");
    $(".btn-delete").removeAttr("data-ur");
    $(".btn-save").show();
    $(".slctd-area table").html("");
    $("#tar_alet_id").val("");
    formSet();
  });
  $(".genelbilgipanel")
    .parent()
    .on("click", function (e) {
      e.stopPropagation();
    });
  function makeTableRows(items) {
    const StrRand =
      Handlebars.compile(`<tr data-ur="{{_id}}" data-ind="{{index}}" class="itemrow border-t border-gray-300 hover:bg-gray-100 cursor-pointer">
            <td class="px-1 py-1">{{index}}</td>
            <td class="px-1 py-1">{{kisa_ad}}</td>
            <td class="px-1 py-1">{{pers_name}}</td>
            <td class="px-1 py-1">
                <div>
                      <span>{{marka_model}}</span>,{{#each taksimat}}
                        {{kapasite}}{{birim}}{{#if @last}} {{else}}<span class="pl-1">/</span>{{/if}}
                      {{/each}} 
                      
                   </span>
                </div>
            </td>
              <td class="px-1 py-1">{{mua_tarih}}</td>
             <td class="px-1 py-1">{{next_mua_tarih}}</td>
             {{#IsEq status 'Aktif'}} 
                <td class="status px-1 py-1 text-blue-500 font-bold">{{status}}</td> 
             {{else}} 
                <td class="status px-1 py-1 text-red-500 font-bold">{{status}}</td> 
             {{/IsEq}}
            
          </tr>`);
    $(".listtoparea tbody").html("");
    items = items.sort((a, b) => {
      return !!a.tartialet.marka_model &&
        a.tartialet.marka_model.toLocaleLowerCase() <
          b.tartialet.marka_model.toLocaleLowerCase()
        ? -1
        : 1;
    });
    for (let i = 0; i < items.length; i++) {
      const muayene = items[i];
      $(".listtoparea tbody").append(
        StrRand({
          index: i + 1,
          _id: muayene._id,
          kisa_ad:
            muayene.tartikullanici.gercek_tuzel === "Tüzel"
              ? muayene.tartikullanici.kisa_ad
              : muayene.tartikullanici.ad_soyad,
          pers_name: muayene.personel.name,
          marka_model: muayene.tartialet.marka_model,
          imal_yili: muayene.tartialet.imal_yili,
          sinif: muayene.tartialet.sinif,
          tip: muayene.tartialet.tip,
          taksimat: muayene.tartialet.taksimat,
          status: muayene.tartialet.status,
          mua_tarih: muayene.mua_tarih,
          next_mua_tarih: muayene.next_mua_tarih,
          seri_no:muayene.tartialet.seri_no
        })
      );
    }
    $(".itemrow").off("click");
    $(".itemrow").on("click", function (e) {
      e.stopPropagation();
      $(".itemrow").removeClass("font-bold text-green-600");
      $(".itemrow .status").removeClass("text-green-600");
      let _id = $(this).attr("data-ur");
      $(this).addClass("font-bold text-green-600");
      $(this).find(".status").addClass("text-green-600");
      $(".btn-update").show();
      $(".btn-delete").show();
      $(".btn-update").attr("data-ur", _id);
      $(".btn-delete").attr("data-ur", _id);
      $(".btn-save").hide();
      let selectedItem = items.find((a) => a._id === _id);
      formSet(selectedItem);
    });
  }
  function ReloadItemRows(items) {
    if (!!items && items.length === 0) {
      $(".yokarea").show();
      $(".listtoparea").hide();
    } else if (!!items && items.length > 0) {
      $(".listtoparea").show();
      $(".yokarea").hide();
      makeTableRows(items);
    }
    $(".spinarea").hide();
  }
  const eventSource = new EventSource(`${relurl}/sse`);
  window.addEventListener("beforeunload", () => {
    if (eventSource) eventSource.close();
  });
  const itemsEvent$ = fromEvent(eventSource, "message").pipe(
    map((e) => JSON.parse(e.data))
  );
  let items = await listItems();
  itemsEvent$.subscribe((result) => {
    const { type, data } = result;
    if (type === "insert") {
      items.push(data);
    } else if (type === "replace" || type === "update") {
      const { _id } = data;
      items = items.map((a) => {
        if (a._id === _id) {
          return {
            _id: _id,
            ...data,
          };
        }
        return a;
      });
    } else if (type === "delete") {
      const { _id } = data;
      items = items.filter((a) => a._id !== _id);
    }
    ReloadItemRows(items);
    $("body").trigger("click");
    formSet();
  });
  ReloadItemRows(items);
};
const listItems = () => {
  return $.ajax({
    type: "GET",
    url: `${relurl}/list`,
    dataType: "json",
  });
};
const saveItem = async (data) => {
  return $.ajax({
    type: "POST",
    url: `${relurl}/add`,
    data: { ...data },
    dataType: "json",
  });
};
const updateItem = (_id, data) => {
  return $.ajax({
    type: "POST",
    url: `${relurl}/update`,
    data: { _id: _id, ...data },
    dataType: "json",
  });
};
const updateFullItem = (_id, data) => {
  return $.ajax({
    type: "POST",
    url: `${relurl}/replace`,
    data: { _id: _id, ...data },
    dataType: "json",
  });
};
const deleteItem = (_id) => {
  return $.ajax({
    type: "POST",
    url: `${relurl}/delete`,
    data: { _id: _id },
    dataType: "json",
  });
};

const GetTartiAletler = async () => {
  return await $.ajax({
    type: "GET",
    url: `${relurl}/tartialetler/list`,
    dataType: "json",
  });
};
const GetDenetciler = async () => {
  let denetciler = await $.ajax({
    type: "GET",
    url: `${relurl}/personel/list`,
    dataType: "json",
  });
  let str = ``;
  for (let i = 0; i < denetciler.length; i++) {
    const denetci = denetciler[i];
    str += `<option value="${denetci._id}">${denetci.name}</option>`;
  }
  $("#pers_id").html(str);
  return denetciler;
};

const TartiAletSec = async () => {
  function makerows(tartialetler, cb) {
    let RowText = `<tr data-ur="{{_id}}" data-ind="{{index}}" class="itemrow border-t border-gray-300 hover:bg-gray-100 cursor-pointer">
            <td class="px-1 py-1">{{index}}</td>
            <td class="px-1 py-1">{{kisa_ad}}</td>
            <td class="px-1 py-1">
                <div class="line-clamp-1">
                    {{marka_model}}
                </div>
            </td>
            <td class="px-1 py-1">{{seri_no}}</td>
            <td class="px-1 py-1">{{imal_yili}}</td>
            <td class="px-1 py-1">{{sinif}}</td>
             <td class="px-1 py-1">{{tip}}</td>
             <td class="px-1 py-1">
              {{#each taksimat}}
                {{kapasite}}{{#if @last}} {{else}}<span class="pl-1">/</span>{{/if}}
              {{/each}}
             </td>
             {{#IsEq status 'Aktif'}} 
                <td class="status px-1 py-1 text-blue-500 font-bold">{{status}}</td> 
             {{else}} 
                <td class="status px-1 py-1 text-red-500 font-bold">{{status}}</td> 
             {{/IsEq}}
            
          </tr>`;
    let trRand = Handlebars.compile(RowText);
    if (!!tartialetler && tartialetler.length === 0) {
      $(".pop-tartialetsec .poptblarea").hide();
      $(".pop-tartialetsec .popspinarea").hide();
      $(".pop-tartialetsec .popyokarea").show();
    } else if (!!tartialetler && tartialetler.length > 0) {
      $(".pop-tartialetsec .poptblarea").show();
      $(".pop-tartialetsec .popspinarea").hide();
      $(".pop-tartialetsec .popyokarea").hide();
      $(".pop-tartialetsec tbody").html("");
      for (let i = 0; i < tartialetler.length; i++) {
        const alet = tartialetler[i];
        let kisa_ad =
          alet.tartikullanici.gercek_tuzel === "Gerçek"
            ? alet.tartikullanici.ad_soyad
            : alet.tartikullanici.kisa_ad;
        $(".pop-tartialetsec tbody").append(
          trRand({ index: i + 1, kisa_ad: kisa_ad, ...alet })
        );
      }
      $(".poptblarea tr").on("click", function (e) {
        e.stopPropagation();
        let _id = $(this).attr("data-ur");
        let selectedTartiAlet = tartialetler.find((a) => a._id === _id);
        $(".pop-tartialetsec").remove();
        cb(selectedTartiAlet);
      });
    }
  }
  async function PopTartiAletler(cb) {
    let poptartiStr = `<div 
    class="pop-tartialetsec fixed top-0 left-0 right-0 bottom-0 bg-black/10 flex items-center justify-center flex-col z-[990]">
    <div class="w-2/3 h-[85%] bg-white   rounded flex flex-col shadow-[0_0_5px_1px_rgba(0,0,0,0.3)]">
        <div class="p-2 flex items-center space-x-4">
            <div class="font-bold pl-2">Tartı Aleti Seç</div>
            <div class="flex-1"></div>
            <div class="border border-gray-200 rounded flex items-center bg-smoke px-2 py-0.5 space-x-2">
                <div class="tio text-[1.2rem] text-[--l-gray]">search</div>
                <input type="text" placeholder="Ara" id="search"
                    class="bg-transparent w-full text-[0.9rem] text-gray-600">
            </div>
            <button class="text-[1.4rem] tio btn-close">clear</button>
        </div>
        <div class="flex-1 px-2">
            <div style="display:none" class="poptblarea py-2 px-2 flex items-center relative">
                <table class="border-collopse w-full text-[0.8rem]">
                    <thead>
                        <tr>
                            <th class="w-[35px] text-start sticky top-0 bg-white px-1">Sıra</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Tart.Kulanıcı</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Marka/Model</th>
                            <th class="w-[100px]  text-start sticky top-0 bg-white px-1">Serino</th>
                            <th class=" text-start sticky top-0 bg-white px-1">İmal Yılı</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Sınıf</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Tip</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Taksimat</th>
                            <th class=" text-start sticky top-0 bg-white px-1">Durum</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
            <div class="popspinarea py-20 text-center">
                <div class="spin icon-spin-1 spin-steps1 text-[2rem] text-[--m-green]"></div>
            </div>
            <div style="display:none" class="popyokarea py-20 text-center">
                <div class="font-semibold text-black/35 ">Veri Yok</div>
            </div>
        </div>
        <div class="py-2 px-2">
            Button area
        </div>
    </div>
</div>`;
    let StrRand = Handlebars.compile(poptartiStr);
    $("body").append(StrRand({}));
    let tartialetler = await GetTartiAletler();
    makerows(tartialetler, cb);
    $(".pop-tartialetsec .btn-close").on("click", function (e) {
      e.stopPropagation();
      $(".pop-tartialetsec").remove();
      cb();
    });
  }
  $(".btn-alet-sec").on("click", async function (e) {
    e.stopPropagation();
    PopTartiAletler((data) => {
      if (!!data) {
        let strSelctAreaColsRand =
          Handlebars.compile(`<tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Tart.Kull</th>
                            <th class="w-[10px]">:</th>
                            <td>{{kisa_ad}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Marka</th>
                            <th class="w-[10px]">:</th>
                            <td>{{marka_model}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Sınıf</th>
                            <th class="w-[10px]">:</th>
                            <td>{{sinif}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Taksimat</th>
                            <th class="w-[10px]">:</th>
                            <td>
                            {{#each taksimat}}
                {{kapasite}}{{#if @last}} {{else}}<span class="pl-1">/</span>{{/if}}
              {{/each}}
                            </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">İmal Yılı</th>
                            <th class="w-[10px]">:</th>
                            <td>{{imal_yili}}</td>
                        </tr>
                         <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Tip</th>
                            <th class="w-[10px]">:</th>
                            <td>{{tip}}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <th class="w-1/4 text-start">Durum</th>
                            <th class="w-[10px]">:</th>
                            <td>{{status}}</td>
                        </tr>`);

        let kisa_ad =
          data.tartikullanici.gercek_tuzel === "Gerçek"
            ? data.tartikullanici.ad_soyad
            : data.tartikullanici.kisa_ad;
        $(".slctd-area table").html(
          strSelctAreaColsRand({
            ...data,
            kisa_ad: kisa_ad,
          })
        );
        $("#tar_alet_id").val(data._id);
      }
    });
  });
};
