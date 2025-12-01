import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Validator } from "./util/validator.js";
import { AdresArea } from "./util/adres.js";
let adres$;
let relurl = "/superpanel/ymsfirmalar";
export default Initfnc = () => {
  console.log("YmsFirmalar");
  adres$ = AdresArea(".adres1");
  formSet();
  watchItems();
  $(".btn-save").on("click", async function () {
    // console.log(getFormData());
    let formData = $(".genelbilgipanel").serializeJSON();
    let isValid = Validator(formData, "genelbilgipanel");
    if (isValid) {
      let result = await saveItem(formData);
      console.log(result);
    }
  });
  $(".btn-update").on("click", async function () {
    // console.log(getFormData());
    let formData = $(".genelbilgipanel").serializeJSON();
    let isValid = Validator(formData, "genelbilgipanel");
    if (isValid) {
      let _id = $(".btn-update").attr("data-ur");
      let result = await updateItem(_id, formData);
      console.log(result);
    }
  });
  $(".btn-delete").on("click", async function () {
    let _id = $(this).attr("data-ur");
    if (!!_id) {
      let result = await deleteItem(_id);
      console.log(result);
    }
  });
};

const formSet = async (data) => {
  if (!data) {
    $(".genelbilgipanel")[0].reset();
    adres$.next({});
    $(".genelbilgipanel #aktif").trigger("click");
    return;
  }
  adres$.next({
    il: data.il,
    ilce: data.ilce,
    mahalle: data.mahalle,
  });
  if (data.status === "Aktif") {
    $(".genelbilgipanel #aktif").trigger("click");
  } else {
    $(".genelbilgipanel #pasif").trigger("click");
  }
  const allowed = [
    "adres",
    "email",
    "kisa_ad",
    "telefon",
    "unvan",
    "vergi_no_tc",
    "yetkili_kisi",
    "yms_no",
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
            <td class="px-1 py-1">
                <div class="line-clamp-1">
                    {{kisa_ad}}
                </div>
            </td>
            <td class="px-1 py-1">{{yms_no}}</td>
            <td class="px-1 py-1">{{vergi_no_tc}} </td>
            <td class="px-1 py-1">{{yetkili_kisi}}</td>
             {{#IsEq status 'Aktif'}} 
                <td class="status px-1 py-1 text-blue-500 font-bold">{{status}}</td> 
             {{else}} 
                <td class="status px-1 py-1 text-red-500 font-bold">{{status}}</td> 
             {{/IsEq}}
            
          </tr>`);
    $(".listtoparea tbody").html("");
    items = items.sort((a, b) =>
      a.kisa_ad.toLocaleLowerCase() < b.kisa_ad.toLocaleLowerCase() ? -1 : 1
    );
    for (let i = 0; i < items.length; i++) {
      const firma = items[i];
      $(".listtoparea tbody").append(StrRand({ index: i + 1, ...firma }));
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
      let selectedFirma = items.find((a) => a._id === _id);
      formSet(selectedFirma);
    });
  }
  function updateTableRow(id) {
    let StrRand = Handlebars.compile(`<td class="px-1 py-1">{{index}}</td>
            <td class="px-1 py-1">
                <div class="line-clamp-1">
                    {{kisa_ad}}
                </div>
            </td>
            <td class="px-1 py-1">{{yms_no}}</td>
            <td class="px-1 py-1">{{vergi_no_tc}} </td>
            <td class="px-1 py-1">{{yetkili_kisi}}</td>
             {{#IsEq status 'Aktif'}} 
                <td class="status px-1 py-1 text-blue-500 font-bold">{{status}}</td> 
             {{else}} 
                <td class="status px-1 py-1 text-red-500 font-bold">{{status}}</td> 
             {{/IsEq}}`);
    let newData = $(".genelbilgipanel").serializeJSON();
    let index = $(`.itemarea  tr[data-ur='${id}']`).attr("data-ind");
    $(`.itemarea  tr[data-ur='${id}']`).html(
      StrRand({ index: index, ...newData })
    );
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
    } else if (type === "update") {
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
const deleteItem = (_id) => {
  return $.ajax({
    type: "POST",
    url: `${relurl}/delete`,
    data: { _id: _id },
    dataType: "json",
  });
};
