"use strict";

const OUTDOOR_URL = "https://api.airtable.com/v0/appyPO0xrhPPEy72s/Outdoor";
const INDOOR_URL = "https://api.airtable.com/v0/appyPO0xrhPPEy72s/Indoor";

// function for our list view (both types)
async function fetchCourts() {
  let getResultElement = document.getElementById("container");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patSMmsMZV3ld7iSm.adf9b201bf5b4fad908e372c585816eb2521b5e7086b7a3c9418caaa099ad817`
    },
  };
  // Fetch both Outdoor and Indoor courts in parallel
  const [outdoorData, indoorData] = await Promise.all([
    fetch(OUTDOOR_URL, options).then((response) => response.json()),
    fetch(INDOOR_URL, options).then((response) => response.json()),
  ]);
  // Combine both records
  const allRecords = [...outdoorData.records, ...indoorData.records];
  renderCourts(allRecords);
}

// Only Outdoor courts
async function fetchOutdoorCourts() {
  let getResultElement = document.getElementById("container");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patSMmsMZV3ld7iSm.adf9b201bf5b4fad908e372c585816eb2521b5e7086b7a3c9418caaa099ad817`
    },
  };
  const outdoorData = await fetch(OUTDOOR_URL, options).then((response) => response.json());
  renderCourts(outdoorData.records);
}

// Only Indoor courts
async function fetchIndoorCourts() {
  let getResultElement = document.getElementById("container");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patSMmsMZV3ld7iSm.adf9b201bf5b4fad908e372c585816eb2521b5e7086b7a3c9418caaa099ad817`
    },
  };
  const indoorData = await fetch(INDOOR_URL, options).then((response) => response.json());
  renderCourts(indoorData.records);
}

// Helper to render courts
function renderCourts(records) {
  let getResultElement = document.getElementById("container");
  getResultElement.innerHTML = "";
  let newHtml = "";
  for (let i = 0; i < records.length; i++) {
    let courtName = records[i].fields["Name"];
    let courtAddress = records[i].fields["Address"];
    let courtZip = records[i].fields["Zip"];
    let courtMap = records[i].fields["Map"];
    let courtNumberOfCourts = records[i].fields["Number of Courts"];
    let courtAvailability = records[i].fields["Availability"];
    let courtImage = records[i].fields["Images"];
    newHtml += `
      <div class="col-md-4 court-card">
        <div class="card">
          ${courtImage ? `<img src="${courtImage[0].url}" alt="Photo of ${courtName}">` : ``}
          <div class="card-body">
            <h5 class="card-title">
               ${courtName}
            </h5>
            <p>${courtAddress}</p>
            <a class="mt-1 btn btn-primary mt-2" href="index.html?id=${
              records[i].id
            }">View Details</a>
          </div>
        </div>
      </div>
    `;
  }
  getResultElement.innerHTML = newHtml;
}

function formatPhoneNumber(phoneNumberString) {
  let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    let intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
}

function fetchSingleCourt(courtId) {
  let courtResultElement = document.getElementById("court-container");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patuwPLWf5SBeDkyT.45118f887bbc6a79e8bb6c9d327b8c8105866bb0d6a0cdc2290006ddec22a74d`,
    },
  };
  fetch(`${PICKLEBALL_URL}/${courtId}`,
      options
     )
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // response is a single object
    let courtPic = data.fields["image"];
    let courtName = data.fields["name"];
    let courtDescription = data.fields["description"];
    let courtAddress = data.fields["address"];
    let courtHours = data.fields["hours"];
    let courtURL = data.fields["url"];
    let courtPhone = formatPhoneNumber(data.fields["phone"]);
    let courtLanes = data.fields["lanes"];
    let courtCost = data.fields["cost"];
    let courtLeagues = data.fields["league"];
    let hoursHtml = "";
    if ("hours" in data.fields) {
      hoursHtml += "<ul>";
      let hours = data.fields["hours"].split("\n\n");
      for (let i = 0; i < hours.length; i++) {
        hoursHtml += `<li>${hours[i]}</li>`;
      }
      hoursHtml += "</ul>";
    }
    let newHtml = `
      <div class="row">
        <a class="back-button btn w-auto col-3" href="./index.html">Back to Courts List</a>
      </div>
      <div class="row">
        <div class="col">
          ${
            courtPic
              ? `<img class="details-image" src="${courtPic[0].url}" alt="Photo of ${courtName}">`
              : ``
          }
          <h4>Official Website</h4>
           <a href="${courtURL}" target="_blank">${courtName}</a>
          <hr>
          <h4>Contact</h4>
          <p>${courtPhone}</p>
        </div>
        <div class="col-lg-7">
            <h2 id="details-title">${courtName} - ${courtLanes} Courts</h2>
            <hr>
            <h4>Description</h4>
            <p>${courtDescription}</p>
            <hr>
            <h4>Address</h4>
            <p class="addresses">${courtAddress}</p>
            <hr>
            <h4>Hours</h4>
            <p>${hoursHtml}</p>
            <hr>
            <h4>Pricing</h4>
            <p>${courtCost}</p>
            <hr>
            <h4>League</h4>
            <p>${courtLeagues ? `${courtName} has Leagues!` : `${courtName} doesn't have Leagues.`}</p>
        </div>
      </row>
    `;
    courtResultElement.innerHTML = newHtml;
  });
}

// function searchFunction() {
//   var input, filter, cardimagetext, i, x;
//   input = document.getElementById("myinput");
//   filter = input.value.toUpperCase();
//   cardimagetext = document.getElementsByClassName("alley-card");

//   for (x = 0; x < cardimagetext.length; x++) {
//     i = cardimagetext[x].getElementsByClassName("addresses")[0];
//     if (i.innerHTML.toUpperCase().indexOf(filter) > -1) {
//       cardimagetext[x].style.display = "";
//     } else {
//       cardimagetext[x].style.display = "none";
//     }
//   }
// }

// look up window.location.search and split, so this would take
// https://dmspr2021-airtable-app.glitch.me/index.html?id=receHhOzntTGZ44I5
// and look at the ?id=receHhOzntTGZ44I5 part, then split that into am array
// ["id?=", "receHhOzntTGZ44I5"] and then we only choose the second one

let idParams = window.location.search.split("?id=");
if (idParams.length >= 2) {
  // has at least ["id?", "OUR ID"]
  fetchSingleCourt(idParams[1]); // create detail view HTML w/ our id
} else {
  fetchCourts(); // no id given, fetch summaries
}

// --- Carousel for SF Pickleball Courts on Splash Page ---
async function fetchSFCourtsForCarousel() {
  const OUTDOOR_URL = "https://api.airtable.com/v0/appyPO0xrhPPEy72s/Outdoor";
  const INDOOR_URL = "https://api.airtable.com/v0/appyPO0xrhPPEy72s/Indoor";
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patSMmsMZV3ld7iSm.adf9b201bf5b4fad908e372c585816eb2521b5e7086b7a3c9418caaa099ad817`
    },
  };
  // Fetch both Outdoor and Indoor courts
  const [outdoorData, indoorData] = await Promise.all([
    fetch(OUTDOOR_URL, options).then((response) => response.json()),
    fetch(INDOOR_URL, options).then((response) => response.json()),
  ]);
  // Filter for SF courts (Zip starts with 941 or Address contains 'San Francisco')
  const isSF = (fields) => {
    return (fields["Zip"] && fields["Zip"].toString().startsWith("941")) ||
      (fields["Address"] && fields["Address"].toLowerCase().includes("san francisco"));
  };
  let sfCourts = [...outdoorData.records, ...indoorData.records].filter(r => isSF(r.fields));
  // Sort by 'Popularity' field descending (if present)
  sfCourts = sfCourts.sort((a, b) => {
    const popA = a.fields["Popularity"] || 0;
    const popB = b.fields["Popularity"] || 0;
    return popB - popA;
  });
  renderCarousel(sfCourts);
}

function renderCarousel(courts) {
  const carouselInner = document.getElementById("carousel-inner");
  if (!carouselInner) return;
  let html = "";
  for (let i = 0; i < courts.length && i < 5; i++) { // Show up to 5 courts
    const fields = courts[i].fields;
    const img = fields["Images"] ? fields["Images"][0].url : "";
    const name = fields["Name"] || "Pickleball Court";
    const address = fields["Address"] || "";
    html += `
      <div class="carousel-item${i === 0 ? ' active' : ''}">
        <img src="${img}" class="d-block w-100" alt="${name}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${name}</h5>
          <p>${address}</p>
        </div>
      </div>
    `;
  }
  carouselInner.innerHTML = html;
}

// On splash page, run this to populate carousel
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  window.addEventListener("DOMContentLoaded", fetchSFCourtsForCarousel);
}
