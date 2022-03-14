import axiosHook from "./axiosHook";
import Swal from "sweetalert2";

const countryWrapper = document.getElementById("wrapper");

// go back
document.getElementById("goBack").addEventListener("click", () => {
  window.history.back();
});

const loader = `
  <div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>`;

let loading: boolean = true;
const loaderElem = document.getElementById("loader");

(async () => {
  // get query from url
  const query = new URLSearchParams(window.location.search);
  const country = query.get("country");
  try {
    if (loading) loaderElem.innerHTML = loader;
    console.log("loading...");
    const data = await axiosHook.get(`/name/${country}`);
    loading = false;
    !loading && loaderElem.remove();
    const {
      name,
      flag,
      nativeName,
      topLevelDomain,
      capital,
      region,
      subregion,
      population,
      currencies,
      borders,
      languages,
    } = data[0];
    const elem = `
    <section class="wrapper-img">
        <img loading="lazy" src=${flag} alt=${name}>
      </section>

      <section class="wrapper-content">
        <h3>${name}</h3>
        <section>
          <div>
            <p class="white-text">Native Name: <span>${nativeName}</span></p>
            <p class="white-text">Population: <span>${Number(
              population
            ).toLocaleString()}</span></p>
            <p class="white-text">Region: <span>${region}</span></p>
            <p class="white-text">Sub Region: <span>${subregion}</span></p>
            <p class="white-text">Capital: <span>${capital}</span></p>
          </div>
          <div>
            <p class="white-text">Top Domain: <span>${
              topLevelDomain[0]
            }</span></p>
            <p class="white-text">Currencies: 
              ${currencies.map((currency) => {
                return `<span>${currency.name}</span>`;
              })}
            </p>
            <p class="white-text">Languages: 
              ${languages.map((language) => {
                return `<span>${language.name}</span>`;
              })}
            </p>
          </div>
        </section>

        <section class="border-wrapper">
          <p class="white-text">Border Countries:</p>
          <div id="border-countries class="border-countries">
          ${borders.map((border) => {
            return `<button data-id=${border} class="btn btn-dark-sm">
            ${border}</button>`;
          })}
          </div>
        </section>
      </section>
    `;
    countryWrapper.innerHTML = elem;
  } catch (err: any) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: err.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
})();

countryWrapper.addEventListener("click", (e) => {
  e.preventDefault();
  const country = e.target.dataset.id;
  if (country) {
    console.log(country);
    // switch to country.html
    const url = `country.html?country=${country.toLowerCase()}`;
    window.location.href = url;
  }
});
