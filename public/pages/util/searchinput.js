const { fromEvent } = rxjs;
const { ajax } = rxjs.ajax;
const { map, debounceTime, distinctUntilChanged, switchMap, take } =
  rxjs.operators;
export const SearchInput = ({
  compclass,
  key,
  url = "/settings/cihazmarkalar",
}) => {
  function makeAreas(data) {
    if (!!data && data.length == 0) {
      $(`.${compclass} .srchlist`).html("");
      $(`.${compclass} .srchspin`).css("display", "none");
      $(`.${compclass} .txtsnc`).html(`
            <div>Model bulunmadı</div>
            <div>
              <button class="btn-ekle-mdoel text-white px-2 py-0.5 text-[0.8rem] rounded bg-blue-500 hover:bg-blue-600 active:bg-blue-400">
              Tamam</button>
            </div>
          `);
      $(`.${compclass} .txtsnc`).css("display", "block");
      $(".btn-ekle-mdoel").on("click", async function (e) {
        e.preventDefault();
        $(`.${compclass} [name='marka']`).val(
          $(`.${compclass} .srchtxt`).val()
        );
        // ajax.post(url,{[key]:$(`.${compclass} .srchtxt`).val()}).pipe(map(a=>a.response)).subscribe(item=>{
        //   // console.log(item);
        // });
      });
    } else if (!!data && data.length > 0) {
      $(`.${compclass} .srchlist`).html("");
      $(`.${compclass} .srchspin`).css("display", "none");
      $(`.${compclass} .txtsnc`).html("");
      $(`.${compclass} .txtsnc`).css("display", "none");
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        $(`.${compclass} .srchlist`).append(
          `<button data-ur="${item.id}" class="itemslce px-2 py-1 w-full hover:bg-black/5 text-start">${item[key]}</button>`
        );
      }
      $(`.${compclass} .itemslce`).on("click", function (e) {
        e.preventDefault();
        let finded = data.find((a) => a.id == $(this).attr("data-ur"));
        $(`.${compclass} [name='${key}']`).val(finded[key]);
      });
    } else {
      $(`.${compclass} .srchlist`).html("");
      $(`.${compclass} .srchspin`).css("display", "none");
      $(`.${compclass} .txtsnc`).html("Arama Yapın");
      $(`.${compclass} .txtsnc`).css("display", "block");
    }
  }
  $(`.${compclass} .clickarea`).on("click", function (e) {
    $(`.${compclass} .resltarea`).css("display", "block");
    $(`.${compclass} .srchtxt`).focus();
    $(`.${compclass} .srchtxt`).select();
    ajax.get(url + "?search=")
      .pipe(
        take(1),
        map(a=>a.response)
      )
      .subscribe((data) => {
        makeAreas(data);
      });
  });
  $(`body`).on("click", function (e) {
    if (
      !($(e.target).hasClass("clickarea") || $(e.target).hasClass("srchtxt"))
    ) {
      $(`.${compclass} .resltarea`).css("display", "none");
    }
  });
  fromEvent($(`.${compclass} .srchtxt`), "keyup")
    .pipe(
      map((e) => {
        $(`.${compclass} .srchlist`).html("");
        $(`.${compclass} .srchspin`).css("display", "flex");
        $(`.${compclass} .txtsnc`).html("Arama yapınız");
        $(`.${compclass} .txtsnc`).css("display", "none");
        return e.target.value;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query.length < 3) return Promise.resolve("");
        console.log(query);
        return $.get(url + "?search=" + query); // AJAX isteği
      })
    )
    .subscribe((data) => {
      makeAreas(data);
    });
};
