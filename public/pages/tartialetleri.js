import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import { Validator } from "./util/validator.js";
let relurl = "/ctrlpanel/tartialetler";
export default Initfnc = async () => {
  console.log("Tarti kullanıclar");
  makeKullaniciOptions();
  $("[name='taksimat_adet']").on("change", function () {
    let val = $(this).val();
    const strRand =
      Handlebars.compile(`<div class="grid grid-cols-4 gap-2 pb-2">
          <div class="">
            {{#ifCond index '==' 0}}
            <label for="taksimat[{{index}}][kapasite]" class="frm-lbl">Kapasite</label>
            {{/ifCond}}
            <input type="text" class="frm-txt" name="taksimat[{{index}}][kapasite]" id="taksimat[{{index}}][kapasite]"
              placeholder="Kapasite">
          </div>
          <div class="">
          {{#ifCond index '==' 0}}
            <label for="taksimat[{{index}}][birim]" class="frm-lbl">Birim</label>
               {{/ifCond}}
            <select name="taksimat[{{index}}][birim]" id="taksimat[{{index}}][birim]" class="frm-slct">
              <option value="kg">kilogram</option>
              <option value="g">gram</option>
            </select>
          </div>
          <div class="">
          {{#ifCond index '==' 0}}
            <label for="taksimat[{{index}}][e_sabit]" class="frm-lbl">e Sabiti</label>
               {{/ifCond}}
            <input type="number" class="frm-txt" name="taksimat[{{index}}][e_sabit]" id="taksimat[{{index}}][e_sabit]"
              placeholder="e Sabit">
          </div>
          <div class="">
          {{#ifCond index '==' 0}}
            <label for="taksimat[{{index}}][d_taks_ara]" class="frm-lbl">d Taks.Ara.</label>
               {{/ifCond}}
            <input type="number" class="frm-txt" name="taksimat[{{index}}][d_taks_ara]" id="taksimat[{{index}}][d_taks_ara]"
              placeholder="d Taksimat Aralık">
          </div>
        </div>`);

    $(".taks-area").html("");
    for (let i = 0; i < val; i++) {
      $(".taks-area").append(strRand({ index: i }));
    }
  });
  formSet();
  watchItems();
  $(".btn-save").on("click", async function () {
    let formData = $(".genelbilgipanel").serializeJSON();
    let isValid = Validator(formData, "genelbilgipanel");
    if (isValid) {
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
};

const makeKullaniciOptions = async () => {
  let kullanicilar = await $.ajax({
    type: "GET",
    url: `/ctrlpanel/tartikullanici/listname`,
    dataType: "json",
  });
  kullanicilar = kullanicilar.map((a) => {
    return {
      _id: a._id,
      name: !!a.kisa_ad ? a.kisa_ad : a.ad_soyad,
    };
  });
  $("#tar_kul_id").html("");
  for (let i = 0; i < kullanicilar.length; i++) {
    const kullanici = kullanicilar[i];
    $("#tar_kul_id").append(
      `<option value="${kullanici._id}">${kullanici.name}</option>`
    );
  }
};
const formSet = async (data) => {
  if (!data) {
    $(".genelbilgipanel")[0].reset();
    $("#aktif").trigger("click");
    $("#taksimat_adet1").trigger("click");
    return;
  }
  if (data.status === "Aktif") {
    $("#aktif").trigger("click");
  } else {
    $("#pasif").trigger("click");
  }
  $(`#taksimat_adet${data.taksimat_adet}`).trigger("click");
  const allowed = [
    "tar_kul_id",
    "marka_model",
    "seri_no",
    "imal_yili",
    "tip",
    "sinif",
    "taksimat",
    "son_mua_tarih",
    "next_mua_tarih",
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

  let taksimat = Object.values(data.taksimat);
  for (let i = 0; i < taksimat.length; i++) {
    const item = taksimat[i];
    for (let j = 0; j < Object.entries(item).length; j++) {
      const entr = Object.entries(item)[j];
      $(`.genelbilgipanel [name='taksimat[${i}][${entr[0]}]']`).val(entr[1]);
    }
  }

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
    formSet();
  });
  $(".genelbilgipanel")
    .parent()
    .on("click", function (e) {
      e.stopPropagation();
    });
  function makeTableRows(items) {
    const StrRand =
      Handlebars.compile(` <tr data-ur="{{_id}}" data-ind="{{index}}" class="itemrow border-t border-gray-300 hover:bg-gray-100 cursor-pointer">
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
            
          </tr>`);
    $(".listtoparea tbody").html("");
    items = items.sort((a, b) => {
      return !!a.marka_model &&
        a.marka_model.toLocaleLowerCase() < b.marka_model.toLocaleLowerCase()
        ? -1
        : 1;
    });
    for (let i = 0; i < items.length; i++) {
      const aletler = items[i];

      if (!!aletler.tartikullanici) {
        if (aletler.tartikullanici.gercek_tuzel === "Gerçek") {
          $(".listtoparea tbody").append(
            StrRand({
              index: i + 1,
              kisa_ad: aletler.tartikullanici.ad_soyad,
              ...aletler,
            })
          );
        } else {
          $(".listtoparea tbody").append(
            StrRand({
              index: i + 1,
              kisa_ad: aletler.tartikullanici.kisa_ad,
              ...aletler,
            })
          );
        }
      }
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
  let items = await listItemsAgg();
  itemsEvent$.subscribe((result) => {
    const { type, data,tartikullanici } = result;
    if (type === "insert" ) {
      items.push({...data,tartikullanici:tartikullanici});
    } else if (type === "replace" || type === "update") {
      const { _id } = data;
      items = items.map((a) => {
        if (a._id === _id) {
          return {
            ...data,
            tartikullanici:tartikullanici
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
const listItemsAgg = () => {
  return $.ajax({
    type: "GET",
    url: `${relurl}/listagg`,
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
