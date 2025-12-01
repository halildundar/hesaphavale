$(".genel-bilgiler2").append(
    $("<div />", { class: "mb-3 col-6" }).append(
      $("<label />", { for: "adres", class: "form-label", text: "Adres" }),
      $("<input />", {
        type: "text",
        class: "form-control",
        id: "adres",
        placeholder: "Adresiniz",
      })
    ),
    $("<div />", { class: "mb-3 ps-3 col-6" }).append(
      $("<label />", { for: "sirket", class: "form-label", text: "Şirket" }),
      $("<input />", {
        type: "text",
        class: "form-control",
        id: "sirket",
        placeholder: "Şirket",
      })
    )
  );


  $('form')[0].reset(); //first form
  $('#myForm').empty();
  $('form').find('input, select, textarea').val('');
  $('#myForm').find('input:text, input:password, input:file, select, textarea').val('');
  $('#myForm').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected'); 