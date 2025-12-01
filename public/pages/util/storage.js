import { RandomId, GetTempRend } from "./main.js";
/*
    kullanma talimatı
    StoragePop({
        btnSelector:".btn-sm.btn-blue",
        maxfilesize:100,
        folderpath:"/firma1/deneme",
        poptitle:'Firma Evrakları',
        acceptfiles:".pdf,.png"
    },(data)=>{
        console.log(data);
    })
*/
export function DeleteFile(filepath) {
  return $.ajax({
    type: "POST",
    url: "/stat/filedelete",
    data: { filepath: filepath },
    dataType: "json",
  });
}
export const GetFilesList = async (folderpath) => {
  return $.ajax({
    type: "POST",
    url: "/stat/listfiles",
    data: { folderpath: folderpath },
    dataType: "json",
  });
};
export const uplaodFileForStorage = (dest_path, file, rand, btnSelector) => {
  const extstr = GetFileExt(file.name);
  let filename = file.name.replace("." + extstr, "");
  let purrfilename = filename + "_" + rand;
  filename = purrfilename + "." + extstr;
  let formData = new FormData();
  formData.append("dest_path", dest_path);
  formData.append("filename", purrfilename);
  formData.append("file", file, file.name);
  const progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    if (event.lengthComputable) {
      percent = Math.ceil((position / total) * 100);
    }
    $(`.prg${rand}.progress-wrp-sm .progress-bar`).css("width", +percent + "%");
    $(`.prg${rand}.progress-wrp-sm .status`).text(percent + "%");
    if (percent == 100) {
      $(`.prg${rand}.progress-wrp-sm`).css("display", "none");
      $(`.${rand} .btn-indrfile`).css("display", "inline-block");
      $(`.${rand} .btn-rmvfile`).css("display", "inline-block");
      $(`.${rand} .btn-indrfile`).on("click", function () {
        window.open($(this).attr("data-ur"), "_blank");
      });
      $(`.${rand} .btn-rmvfile`).on("click", async function () {
        const resp = await DeleteFile($(this).attr("data-ur"));
        if (resp.msg == "Kaldırıldı") {
          $(btnSelector).trigger("click");
        }
      });
    }
  };
  return $.ajax({
    type: "POST",
    url: "/stat/fileupload",
    xhr: function () {
      var myXhr = $.ajaxSettings.xhr();
      if (myXhr.upload) {
        myXhr.upload.addEventListener("progress", progressHandling, false);
      }
      return myXhr;
    },
    // success:  function(data){
    //   // your callback here

    // },
    // error: function (error) {
    //   // handle error
    // },
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
  });
};
export const GetFileExt = (fname) => {
  return fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
};
export const FileValidation = (file, maxFileSize) => {
  // maxFileSize for mb
  const { name, type, size } = file;
  let newFileData = {
    size: "0 Kb",
    name,
    type,
  };

  if (size / 1024 / 1024)
    if (size / 1024 / 1024 > 1) {
      newFileData["size"] = (size / 1024 / 1024).toFixed(2) + " mb";
    } else if (size / 1024 / 1024 < 1) {
      newFileData["size"] = (size / 1024).toFixed(2) + " kb";
    }
  const isFileBig = size / 1024 / 1024 <= maxFileSize;
  if (!isFileBig) {
    return {
      status: false,
      msg: "Max.dosya boyutu " + maxFileSize + " mb olabilir",
      size: newFileData["size"],
    };
  }
  return {
    status: true,
    file,
    size: newFileData["size"],
  };
};
export const StoragePop = ({ btnSelector, maxfilesize, folderpath,poptitle,accepfiles = "*" }, cb) => {
  let popclass = "popstorage";
  function SelectTr() {
    $(`.${popclass}  tbody tr`).off("click");
    $(`.${popclass}  tbody tr`).on("click", function (e) {
      e.preventDefault();
      $(`.${popclass}  .btn-close`).trigger("click");
      let url = $(this).find(`.btn-indrfile`).attr("data-ur");
      cb({
        url: url,
        filename: url.split("/").pop(),
      });
    });
  }
  $(btnSelector).off();
  $(btnSelector).on("click", async function (e) {
    e.preventDefault();

    $(`.${popclass}`).remove();
    let temp = await GetTempRend("pop-storage.hbs");
    let resp = await GetFilesList("/uploads" + folderpath);
    let files = [];
    if (!!resp.files) {
      files = resp.files.map((item) => {
        if (item.size / 1024 / 1024)
          if (item.size / 1024 / 1024 > 1) {
            item.size = (item.size / 1024 / 1024).toFixed(2) + " mb";
          } else if (item.size / 1024 / 1024 < 1) {
            item.size = (item.size / 1024).toFixed(2) + " kb";
          }
        return item;
      });
    }
    $("body").append(
      temp({
        files: files,
        classname: popclass,
        poptitle:poptitle,
        accepfiles:accepfiles
      })
    );
    SelectTr();
    $(`.${popclass} .btn-indrfile`).on("click", function (e) {
      e.stopPropagation();
      window.open($(this).attr("data-ur"), "_blank");
    });
    $(`.${popclass} .btn-rmvfile`).on("click", async function (e) {
      e.stopPropagation();
      const resp = await DeleteFile($(this).attr("data-ur"));
      if (resp.msg == "Kaldırıldı") {
        $(btnSelector).trigger("click");
      }
    });
    $(`.${popclass} .in-srch`).on("keyup", function () {
      const textStr = $(this).val();
      $(`.${popclass} tbody tr`).each((index, tdEl) => {
        const isMatch = tdEl.outerHTML
          .toLocaleLowerCase()
          .includes(textStr.toLocaleLowerCase());
        if (!isMatch) {
          $(tdEl).css("display", "none");
        } else {
          $(tdEl).css("display", "table-row");
        }
      });
    });
    $(`.${popclass} .btn-close`).on("click", function (e) {
      e.stopPropagation();
      $(`.${popclass}`).remove();
    });
    $(`.${popclass} .infile`).on("change", function () {
      const files = $(this)[0].files;
      for (let i = 0; i < files.length; i++) {
        let rand = RandomId(5);
        const file = files[i];
        let size = 0;
        const extstr = GetFileExt(file.name);
        let filename = file.name.replace("." + extstr, "");
        let purrfilename = filename + "_" + rand;
        filename = purrfilename + "." + extstr;
        if (file.size / 1024 / 1024)
          if (file.size / 1024 / 1024 > 1) {
            size = (file.size / 1024 / 1024).toFixed(2) + " mb";
          } else if (file.size / 1024 / 1024 < 1) {
            size = (file.size / 1024).toFixed(2) + " kb";
          }
        const resValid = FileValidation(file, maxfilesize);
        let strHtm = "";
        if (resValid.status) {
          const file = resValid.file;
          strHtm = `
          <tr class="${rand} border-y border-gray-300 hover:bg-blue-100 cursor-pointer ">
                  <td class="px-2 py-1">
                     <div class="line-clamp-1">${file.name}</div>
                  </td>
                  <td class="px-2 py-1 text-nowrap text-end">${size}</td>
                  <td class=" text-center py-1 px-2">
                     <button style="display:none" class="btn-indrfile underline text-blue-500" data-ur="/uploads${folderpath}/${filename}">İndir</button>
                     <button style="display:none" class="btn-rmvfile underline text-red-600 ml-2" data-ur="/uploads${folderpath}/${filename}">Sil</button>
                     <div class="prg${rand} progress-wrp-sm">
                        <div class="progress-bar"></div>
                        <div class="status">0%</div>
                     </div>
                  </td>
               </tr>
          `;
          $(`.${popclass} tbody`).prepend(strHtm);
          uplaodFileForStorage(
            "/uploads/" + folderpath,
            file,
            rand,
            btnSelector
          );
        } else {
          strHtm = `
          <tr class="${rand} border-y border-gray-300 hover:bg-blue-100 cursor-pointer ">
                  <td class="px-2 py-1">
                     <div class="line-clamp-1">${file.name}</div>
                  </td>
                  <td class="px-2 text-end py-1  text-nowrap">${size}</td>
                  <td class=" py-1 flex items-center justify-between px-2">
                    <div class="text-red-600">Max.${maxfilesize} Mb olabilir!</div>
                    <button class="btn-kldr tio text-red-500 hover:bg-black/10 rounded-full p-1 border border-gray-300">clear</button>
                  </td>
               </tr>
          `;
          $(`.${popclass} tbody`).prepend(strHtm);
          $(`.${rand} .btn-kldr`).on("click", function (e) {
            e.stopPropagation();
            $(`.${rand}`).remove();
          });
        }
      }
      SelectTr();
    });
    $(`.${popclass} .btn-upld`).on("click", function (e) {
      // e.stopPropagation();
      $(`.${popclass} .infile`).val("");
      $(`.${popclass} .infile`).trigger("click");
    });
  });
};
