"use strict";

const Pickle415 =
  "https://api.airtable.com/v0/appyPO0xrhPPEy72s/Outdoor";

// function for our list view
async function fetchAlleys() {
  let getResultElement = document.getElementById("container");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patSMmsMZV3ld7iSm.adf9b201bf5b4fad908e372c585816eb2521b5e7086b7a3c9418caaa099ad817`
    },
  };

  await fetch(
    `${Pickle415}`,
    options
  )
    .then((response) => response.json())

    .then((data) => {
      console.log(data); // response is an object w/ .records array

      getResultElement.innerHTML = ""; // clear alleys

      let newHtml = "";

      for (let i = 0; i < data.records.length; i++) {
        let courtName = data.records[i].fields["Name"];
        let courtAddress = data.records[i].fields["Address"];
        let courtZip = data.records[i].fields["Zip"];
        let courtMap = data.records[i].fields["Map"];
        let courtNumberOfCourts = data.records[i].fields["Number of Courts"];
        let courtAvailability = data.records[i].fields["Availability"];
        let courtImage = data.records[i].fields["Images"];

        newHtml += `
        
          <div class="col-md-4 alley-card">
            <div class="card">
              ${courtImage ? `<img src="${courtImage[0].url}" alt="Photo of ${courtName}">` : ``}
              <div class="card-body">
                <h5 class="card-title">
                   ${courtName}
                </h5>
                <p>${courtAddress}</p>
                <a class="mt-1 btn btn-primary mt-2" href="index.html?id=${
                  data.records[i].id
                }">View Details</a>
              </div>
            </div>
          </div>
    
        `;
      }

      getResultElement.innerHTML = newHtml;
    });
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

function fetchSingleAlley(alleyId) {
  let alleyResultElement = document.getElementById("alley-container");
  
    const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patuwPLWf5SBeDkyT.45118f887bbc6a79e8bb6c9d327b8c8105866bb0d6a0cdc2290006ddec22a74d`,
    },
  };

    fetch(`${BOWLING_URL}/${alleyId}`,
        options
       )
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // response is a single object

      let alleyPic = data.fields["image"];
      let alleyName = data.fields["name"];
      let alleyDescription = data.fields["description"];
      let alleyAddress = data.fields["address"];
      let alleyHours = data.fields["hours"];
      let alleyURL = data.fields["url"];
      let alleyPhone = formatPhoneNumber(data.fields["phone"]);
      let alleyLanes = data.fields["lanes"];
      let alleyCost = data.fields["cost"];
      let alleyLeagues = data.fields["league"];

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
          <a class="back-button btn w-auto col-3" href="./index.html">Back to Alleys List</a>
        </div>
        <div class="row">
          <div class="col">
            ${
              alleyPic
                ? `<img class="details-image" src="${alleyPic[0].url}" alt="Photo of ${alleyName}">`
                : ``
            }
            <h4>Official Website</h4>
             <a href="${alleyURL}" target="_blank">${alleyName}</a>
            <hr>
            <h4>Contact</h4>
            <p>${alleyPhone}</p>
          </div>
          <div class="col-lg-7">
              <h2 id="details-title">${alleyName} - ${alleyLanes} Lanes</h2>
              <hr>
              <h4>Description</h4>
              <p>${alleyDescription}</p>
              <hr>
              <h4>Address</h4>
              <p class="addresses">${alleyAddress}</p>
              <hr>
              <h4>Hours</h4>
              <p>${hoursHtml}</p>
              <hr>
              <h4>Pricing</h4>
              <p>${alleyCost}</p>
              <hr>
              <h4>League</h4>
              <p>${alleyLeagues ? `${alleyName} has Leagues!` : `${alleyName} doesn't have Leagues.`}</p>
          </div>
        </row>
      `;

      alleyResultElement.innerHTML = newHtml;
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
  fetchSingleAlley(idParams[1]); // create detail view HTML w/ our id
} else {
  fetchAlleys(); // no id given, fetch summaries
}
