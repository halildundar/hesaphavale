export const Validator = (formData, classname) => {
  for (let i = 0; i < Object.keys(formData).length; i++) {
    const key = Object.keys(formData)[i];
    if (!formData[key] && !!$(`.${classname} [name='${key}']`).attr('required')) {
      $(`.${classname} .errtxt`).html(
        $(`.${classname} [name='${key}']`).prev().text() + " alanı boş olamaz!"
      );
      return false;
    } else if(!!$(`.${classname} [name='${key}']`).attr('required')) {
      if (key == "email") {
        let emailCheck = formData[key].match(
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$/
        );
        if (!emailCheck) {
          $(`.${classname} .errtxt`).html("Email doğru formatta giriniz");
          return false;
        }
      } else if (key == "passw") {
        let passwCheck = formData[key].match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        );
        if (!passwCheck) {
          $(`.${classname} .errtxt`).html(
            "En az 6 karakter, en az bir harf ve bir rakam olmalı"
          );
          return false;
        }
      } else if (key == "telefon") {
        let telefonCheck = formData[key].match(
          /^\+90\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/
        );
        if (!telefonCheck) {
          $(`.${classname} .errtxt`).html(
            "+90 XXX XXX XXXX,+90XXXXXXXXXX telefon alanına şeklinde giriş sağlayın"
          );
          return false;
        }
      } else if (key == "tc") {
        let tcnoCheck = formData[key].match(/^\d{11}$/);
        if (!tcnoCheck) {
          $(`.${classname} .errtxt`).html(
            $(`.${classname} [name='${key}']`).prev().text() +
              " 11 Haneli olmalı rakam"
          );
          return false;
        }
      } else if (key == "vergi_no") {
        let verginoCheck = formData[key].match(/^\d{10}$/);
        if (!verginoCheck) {
          $(`.${classname} .errtxt`).html(
            $(`.${classname} [name='${key}']`).prev().text() +
              " 10 Haneli olmalı rakam"
          );
          return false;
        }
      }
    }
  }

  $(`.${classname} .errtxt`).html("");
  return true;
};
