const scrollChangeItems = (scrollPos) => {
  if (scrollPos > 200) {
    $(".btntop").css("display", "block");
  } else {
    $(".btntop").css("display", "none");
  }
};
export const TopBtnAndScrollPosInit = () => {
  $(window).on("scroll", function () {
    var scrollPos = $(document).scrollTop();
    scrollChangeItems(scrollPos);
  });
  $(".btntop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    // ('html,body').animate({scrollTop: $('#top').offset().top},'slow');
  });
  $("html, body").animate({ scrollTop: 0 }, 10);
};
export const RandomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const GetTempstr = async (hbspath) => {
  return $.ajax({
    type: "POST",
    url: "/template/get-txt",
    data: { filepath: hbspath },
  });
};
export const GetTempRend = async (hbspath) => {
  let str = await GetTempstr(hbspath);
  let rendered = Handlebars.compile(str);
  return rendered;
};
export const SpinnerPop = async (action) => {
  if (action == "open") {
    const render = await GetTempRend("spiner.hbs");
    $("body").append(render({}));
  }
  if (action == "close") {
    $(".genel-spinner").remove();
  }
};
export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
export const GetTarih = async(timestamp) =>{
  const date = new Date(parseInt(timestamp));
  return `${pad(date.getDate(),2)}.${pad(date.getMonth() + 1,2)}.${date.getFullYear()}.`
}

