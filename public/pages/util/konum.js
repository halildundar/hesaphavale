const { ajax } = rxjs.ajax;
const { map } = rxjs.operators;
import { Loader } from "@googlemaps/js-api-loader";

export const MapInit = (classname, fncname) => {
  let mapp;
  let markers = [];
  window[fncname] = () => {
    console.log($(`.${classname} .map`)[0]);
    // document.getElementById("map")
    mapp = new google.maps.Map($(`.${classname} .map`)[0], {
      center: { lat: 39.9208, lng: 32.8541 }, // Ankara default
      zoom: 6,
    });
  };
};

export const GoogleMapInit = async (classname) => {
  let markers = [];
  const loader = new Loader({
    apiKey: "AIzaSyDtcA5drhZ6_R-dXMfwu6-XQBUnZkTbY3Q",
    version: "weekly",
    // ...additionalOptions,
  });
  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await loader.importLibrary(
    "marker"
  );

  let position = { lat: 39.9208, lng: 32.8541 }; // Ankara default
  let googlemap = new Map($(`.${classname} .map`)[0], {
    center: position,
    zoom: 6,
    mapId: classname,
     draggableCursor: 'default'
  });

  // Haritaya tıklanınca marker koy
  googlemap.addListener("click", async function (event) {
    if (markers.length >= 2) {
      // önceki markerları temizle
      markers.forEach((m) => m.setMap(null));
      markers = [];
      $(`.${classname} .distance`).text("");
    }
    let marker = new AdvancedMarkerElement({
      map: googlemap,
      position: event.latLng,
    });

    markers.push(marker);

    // 2 nokta seçildiyse mesafe hesapla
    if (markers.length === 2) {
      let origin = markers[0].position.lat + "," + markers[0].position.lng;
      let destination = markers[1].position.lat + "," + markers[1].position.lng;
        
      try {
        let data = await $.ajax({
          url: "/googlemap/get-distance",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ origin, destination }),
        });
        // console.log(data);
        const {rows,destination_addresses,origin_addresses} = data;
        // console.log(destination_addresses[0],origin_addresses[0])
        if (rows[0].elements[0].status === "OK") {
          let distance = rows[0].elements[0].distance.text;
          $(`.${classname} .distance`).text("Mesafe: " + distance);
        } else {
          $(`.${classname} .distance`).text("Mesafe hesaplanamadı.");
        }
      } catch (error) {
        console.log(error);
        $(`.${classname} .distance`).text("Sunucuya bağlanırken hata oluştu.");
      }
    }
  });
};
