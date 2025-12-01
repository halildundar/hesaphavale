const { ajax } = rxjs.ajax;
const { Subject } = rxjs;
const { switchMap, map} = rxjs.operators;
/*
    KULLANIM talimatı
    -------------------------------
    AdresArea('.adres1');
    adres$.next({il:"BURDUR",ilce:"GÖLHİSAR",mahalle:"PAZAR MAH"});
    adres$.next({il:"BURDUR",ilce:"GÖLHİSAR"});
    adres$.next({il:"ISPARTA"});
    adres$.next({});
*/
export const AdresArea = (classname) => {
  let selectedIl = "";
  let selectedIlce = "";
  let selectedMahalle = "";
  const AdresFormSubject = new Subject();
  const post$ = AdresFormSubject.pipe(
    switchMap((body) =>
      ajax.post("/apiv1/adresinit", body, { "Content-Type": "application/json" })
    ),
    map((a) => a.response)
  );
  post$.subscribe((res) => {
    let { iller, ilceler, mahalleler, selected } = res;
  
    selectedIl = selected.il;
    selectedIlce = selected.ilce;
    selectedMahalle = selected.mahalle;
    $(`${classname} #il`).html("");
    for (let i = 0; i < iller.length; i++) {
      const item = iller[i];
      $(`${classname} #il`).append(
        `<option value='${item.il}' ${
          !!selected.il && selected.il == item.il ? "selected" : ""
        }>${item.il}</option>`
      );
    }
    $(`${classname} #ilce`).html("");
    for (let i = 0; i < ilceler.length; i++) {
      const item = ilceler[i];
      $(`${classname} #ilce`).append(
        `<option value='${item.ilce}' ${
          !!selected.ilce && selected.ilce == item.ilce ? "selected" : ""
        }>${item.ilce}</option>`
      );
    }
    $(`${classname} #mahalle`).html("");
    for (let i = 0; i < mahalleler.length; i++) {
      const item = mahalleler[i];
      $(`${classname} #mahalle`).append(
        `<option value='${item.mahalle}' ${
          !!selected.mahalle && selected.mahalle == item.mahalle
            ? "selected"
            : ""
        }>${item.mahalle}</option>`
      );
    }
    $(`${classname} .pk`).html(`${selected.pk}`);
    $(`${classname} [name='pk']`).val(selected.pk)
  });
  $(`${classname} #il`).on("change", function () {
    AdresFormSubject.next({ il: $(this).val() });
  });
  $(`${classname} #ilce`).on("change", function () {
    AdresFormSubject.next({ il: selectedIl, ilce: $(this).val() });
  });
  $(`${classname} #mahalle`).on("change", function () {
    AdresFormSubject.next({
      il: selectedIl,
      ilce: selectedIlce,
      mahalle: $(this).val(),
    });
  });
  return AdresFormSubject;
};

