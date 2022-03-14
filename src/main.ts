import axiosHook from "./axiosHook";
import Swal from "sweetalert2";

const loader = `
  <div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>`;

let loading: boolean = true;
const loaderElem = document.getElementById("loader");
const countryWrapper = document.getElementById("country-wrapper");

(async () => {
  try {
    if (loading) loaderElem.innerHTML = loader;
    const data = await axiosHook.get("/all");
    loading = false;
    !loading && loaderElem.remove();
    for (let res of data as any) {
      const content = ` 
      <div class="country" data-id="${res.name}">
        <div class="country-flag" data-id="${res.name}">
          <img data-id="${res.name}" loading="lazy" height="300" src=${res.flag}
            alt=${res.name}>
        </div>
        <div class="country-info" data-id="${res.name}">
          <h3 class="country-name" data-id="${res.name}">${res.name}</h3>
          <p data-id="${
            res.name
          }" class="country-data country-population">Population: <span>${Number(
        res.population
      ).toLocaleString()}</span></p>
          <p data-id="${
            res.name
          }" class="country-data country-region">Region: <span>${
        res.region
      }</span></p>
          <p data-id="${
            res.name
          }" class="country-data country-capital">Capital: <span>${
        res.capital
      }</span></p>
        </div>
      </div>
      `;
      countryWrapper.innerHTML += content;
    }
  } catch (err) {
    loading = false;
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: err.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
})();

// search
document.getElementById("search")?.addEventListener("input", function (e) {
  const search = e.target.value.toLowerCase();
  const countries = document.getElementsByClassName("country");
  Array.from(countries).forEach((country) => {
    const name = country
      .getElementsByClassName("country-name")[0]
      .innerText.toLowerCase();
    if (name.indexOf(search) > -1) {
      country.style.display = "block";
    } else {
      country.style.display = "none";
    }
  });
});

// filter
document.getElementById("select")?.addEventListener("change", (e) => {
  const val = e.target.value.toLowerCase();
  const countries = document.getElementsByClassName("country");
  Array.from(countries).forEach((country) => {
    const name = country
      .getElementsByClassName("country-region")[0]
      .innerText.toLowerCase();
    if (val.toLowerCase() == "filter by region") {
      return (country.style.display = "block");
    }
    if (name.indexOf(val) > -1) {
      country.style.display = "block";
    } else {
      country.style.display = "none";
    }
  });
});

// switch to country clicked
countryWrapper?.addEventListener("click", async (e) => {
  e.preventDefault();
  const countryName = e.target.dataset.id;
  if (countryName) {
    // switch to country.html
    const url = `country.html?country=${countryName}`;
    window.location.href = url;
  }
});
