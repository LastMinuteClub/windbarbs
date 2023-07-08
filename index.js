var pointRadius = 6;
var strokeLength = 20;
let minLat = -43.3;
let maxLat = -40.2;
let minLong = 144.77;
let maxLong = 148.2;
let spacing = 0.4;
let markers = [];
let copyActivated = false;
let defaultIconSize = "32px";
let highlightIconSize = "36px";
let previewIconSize = "34px";
var timeout;
var canShrink = false;
var canGrow = true;
var map;

$("document").ready(() => {
  map = L.map("map").setView([-42.0226, 146.3462], 8);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  drawBarbs();

  $(".buttonContainer").css({
    height: highlightIconSize,
    // "padding-bottom": highlightIconSize,
  });
  $("#radius").on("input", () => {
    pointRadius = $("#radius").val();
    if (
      pointRadius &&
      pointRadius != "" &&
      strokeLength &&
      strokeLength != ""
    ) {
      clearBarbs();
      drawBarbs();
    }
  });
  $("#strokeLength").on("input", () => {
    strokeLength = $("#strokeLength").val();
    if (
      strokeLength &&
      strokeLength != "" &&
      pointRadius &&
      pointRadius != ""
    ) {
      clearBarbs();
      drawBarbs();
    }
  });
  $("#generateButton").on("click", () => {
    // copyActivated = !copyActivated;
    console.log(generateBarbLibrary());
  });
  $("#jsDownload").on("mouseover", () => {
    if (copyActivated) {
      $("#jsIcon").css({
        width: highlightIconSize,
        height: highlightIconSize,
      });
    } else {
      $("#jsIcon").hide();
      $("#jsIconDownload").show();
    }
  });
  $("#jsDownload").on("mouseleave", () => {
    if (copyActivated) {
      $("#jsIcon").css({ width: previewIconSize, height: previewIconSize });
    } else {
      $("#jsIcon").show();
      $("#jsIconDownload").hide();
    }
  });
  $("#jsDownload").on("click", () => {
    const barbData = generateBarbLibrary();
    let fileData = `const WIND_BARBS=`;
    fileData += barbData;
    fileData += `;function round(speed){return (Math.round(speed/5.0)*5)};function getWindBarb(speed,degree){let wb=speed<0?WIND_BARBS[0]:speed>355?WIND_BARBS[355]:WIND_BARBS[round(speed)];return wb.replace('225deg',degree+90+'deg')}`;
    const file = new File([fileData], "windbarbs.js", {
      type: "text/plain",
    });
    if (copyActivated) {
      copyToClipboard(fileData);
      copyActivated = false;
      resetButtons();
    } else {
      download(file);
    }
  });
  $("#tsDownload").on("mouseover", () => {
    if (copyActivated) {
      $("#tsIcon").css({
        width: highlightIconSize,
        height: highlightIconSize,
      });
    } else {
      $("#tsIcon").hide();
      $("#tsIconDownload").show();
    }
  });
  $("#tsDownload").on("mouseleave", () => {
    if (copyActivated) {
      $("#tsIcon").css({ width: previewIconSize, height: previewIconSize });
    } else {
      $("#tsIcon").show();
      $("#tsIconDownload").hide();
    }
  });
  $("#tsDownload").on("click", () => {
    const barbData = generateBarbLibrary();
    let fileData = `export class WindBarbs{private WIND_BARBS=`;
    fileData += barbData;
    fileData += `;private round(speed:number){return Math.round(speed/5.0)*5};public getWindBarb(speed:number,degree:number){let wb=speed<0?this.WIND_BARBS[0]:speed>355?this.WIND_BARBS[355]:this.WIND_BARBS[this.round(speed)];return wb.replace("225deg",degree+90+"deg")}}`;
    const file = new File([fileData], "windbarbs.ts", {
      type: "text/plain",
    });
    if (copyActivated) {
      copyToClipboard(fileData);
      copyActivated = false;
      resetButtons();
    } else {
      download(file);
    }
  });
  $("#copy").on("mouseover", () => {
    if (copyActivated) {
      if (canShrink) {
        $("#copyClipboard").css({
          width: previewIconSize,
          height: previewIconSize,
        });
      }
    } else {
      if (canGrow) {
        $("#copyClipboard").css({
          width: previewIconSize,
          height: previewIconSize,
        });
      }
      $("#copyIcon").hide();
      $("#copyClipboard").show();
    }
  });
  $("#copy").on("mouseleave", () => {
    if (copyActivated) {
      if (canShrink) {
        $("#copyClipboard").css({
          width: highlightIconSize,
          height: highlightIconSize,
        });
      } else {
        canShrink = true;
      }
    } else {
      canGrow = true;
      $("#copyIcon").show();
      $("#copyClipboard").hide();
    }
  });
  $("#copy").on("click", () => {
    copyActivated = !copyActivated;
    if (copyActivated) {
      $("#copyClipboard").css({
        width: highlightIconSize,
        height: highlightIconSize,
      });
      canShrink = false;
      $("#tsIcon").css("color", "rgb(62, 71, 194)");
      $("#jsIcon").css("color", "rgb(62, 71, 194)");
      $("#jsIcon").css({
        width: previewIconSize,
        height: previewIconSize,
      });
      $("#tsIcon").css({
        width: previewIconSize,
        height: previewIconSize,
      });
      $("#jsIcon").css("color", "rgb(62, 71, 194)");
    } else {
      resetButtons();
      canGrow = false;
      $("#copyClipboard").css({
        width: defaultIconSize,
        height: defaultIconSize,
      });
      $("#copyIcon").show();
      $("#copyClipboard").hide();
    }
  });
});

function clearBarbs() {
  for (bid of markers) {
    map.removeLayer(bid);
  }
  markers = [];
}
function drawBarbs() {
  let speed = 0;
  for (let lat = minLat; lat <= maxLat; lat += spacing) {
    for (let long = minLong; long <= maxLong; long += spacing) {
      var icon = L.WindBarb.icon({
        lat: lat,
        deg: 135,
        speed: speed,
        pointRadius: pointRadius,
        strokeLength: strokeLength,
      });
      markers.push(L.marker([lat, long], { icon: icon }).addTo(map));
      speed += 5;
    }
  }
  console.log(speed);
}
function generateBarbLibrary() {
  let stringBarbs = {};
  let barbs = $("svg");
  let speed = 0;

  for (b of barbs) {
    let sb = $(b).parent().html();
    if (
      !JSON.stringify(sb).includes("circle") &&
      !JSON.stringify(sb).includes("Leaflet") &&
      !JSON.stringify(sb).includes("noexport")
    ) {
      stringBarbs[speed] = $(b).parent().html();
    }
    speed += 5;
  }
  return JSON.stringify(stringBarbs);
}
function download(file) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  $(".copied").hide();
  $(".copied").removeClass("notify");
  if (timeout) clearTimeout(timeout);
  $(".copied").show();
  $(".copied").addClass("notify");
  timeout = setTimeout(() => {
    $(".copied").hide();
    $(".copied").removeClass("notify");
  }, 2000);
}
function resetButtons() {
  canShrink = false;
  canGrow = true;
  $("#tsIcon").css("color", "rgb(32, 32, 192)");
  $("#jsIcon").css("color", "rgb(32, 32, 192)");
  $("#copyClipboard").css({ width: previewIconSize, height: previewIconSize });
  $("#copyClipboard").hide();
  $("#copyIcon").show();
  $("#copyIcon").css({ width: defaultIconSize, height: defaultIconSize });
  $("#tsIcon").css({ width: defaultIconSize, height: defaultIconSize });
  $("#jsIcon").css({ width: defaultIconSize, height: defaultIconSize });
}
