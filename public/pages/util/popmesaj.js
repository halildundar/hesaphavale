/*
  kullanma  talimatı
      PopMesaj({title:'Kaydedildi',subtitle:'Recusandae aut deserunt ',sure:4000,renk:"purple"});
*/
export const PopMesaj = ({ title = "Başlık", subtitle = "", sure = 2000,renk="red" }) => {
  $(".popmesaj").css('background-color',renk)
  $(".popmesaj .title").html(title);
  $(".popmesaj .subtitle").html(subtitle);
  $(".popmesaj").animate({ bottom: "15px" }, 300);
  let height = $(".popmesaj").height() + 50;
  setTimeout(() => {
    $(".popmesaj").animate({ bottom: `-${height}px` }, 200);
  }, sure);
};
