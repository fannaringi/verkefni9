const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;

  function el(type, className) {
    const element = document.createElement(type);

    if (className) {
      element.setAttribute('class', className);
    }

    return element;
  }

  function createCompanyElement(name, sn, address, active) {
    const div = el('div', 'company');

    const dl = el('dl');

    const nameDt = el('dt');
    nameDt.textContent = 'Nafn';
    dl.appendChild(nameDt);

    const nameDd = el('dd');
    nameDd.textContent = name;
    dl.appendChild(nameDd);

    const snDt = el('dt');
    snDt.textContent = 'Kennitala';
    dl.appendChild(snDt);

    const snDd = el('dd');
    snDd.textContent = sn;
    dl.appendChild(snDd);

    if (active === 1) {
      div.classList.add('company--active');
      const addressDt = el('dt');
      addressDt.textContent = 'Heimilisfang';
      dl.appendChild(addressDt);

      const addressDd = el('dd');
      addressDd.textContent = address;
      dl.appendChild(addressDd);
    } else {
      div.classList.add('company--inactive');
    }

    div.appendChild(dl);

    return div;
  }

  function removeAll(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function displayError(error) {
    const container = companies.querySelector('.results');

    removeAll(container);

    container.appendChild(document.createTextNode(error));
  }


  function displayCompany(companiesList) {
    if (companiesList.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }
    const container = companies.querySelector('.results');
    removeAll(container);

    for (let company of companiesList) { /* eslint-disable-line */
      const {
        name, sn, active, address,
      } = company;

      const div = createCompanyElement(name, sn, address, active);
      container.appendChild(div);
    }
  }


  function displayLoading() {
    const container = companies.querySelector('.results');
    removeAll(container);
    const loadingGifDiv = el('div', 'loading');
    const loadingGifImg = el('img');
    const loadingText = document.createTextNode('Leita að fyrirtækjum...');
    loadingGifImg.src = 'loading.gif';
    loadingGifDiv.appendChild(loadingGifImg);
    loadingGifDiv.appendChild(loadingText);

    container.appendChild(loadingGifDiv);
  }


  function fetchData(company) {
    displayLoading();
    fetch(`${API_URL}${company}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      }).then((data) => {
        displayCompany(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error); /* eslint-disable-line */
      });
  }


  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    if (input.value.trim().length > 0) {
      fetchData(input.value);
    } else {
      displayError('Lén verður að vera strengur');
    }
  }

  function init(_companies) {
    companies = _companies;
    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');

  program.init(companies);
});
