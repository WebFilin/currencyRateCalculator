const rateItemsInput = document.querySelector(".currency-body__wrapper-items");
const rateItemsRate = document.querySelector(".currency-body__wrapper-rate");
const curseValueInput = document.querySelector(
  ".currency-body__currency-curse-input"
);
const curseValueRate = document.querySelector(
  ".currency-body__currency-curse-rate"
);

// Получаем инпут
const inputCurse = document.querySelector(".currency-body__currency-input");

// Отрисовываем введенный в инпут курс 
const drowInputCurse = document.querySelector(".currency-body__view-rate");

// ************
//Основные валюты
const baseCurrencyName = ["USD", "EUR", "GBP", "CNY", "JPY", "CHF"];

// Массив всех курсов валют
const arrAllCurrency = [];

// Базовые валюты для первичного отображения
const arrBaseCurrency = [];

// Деструктурированный массив курсов валют
const arrRateCurrency = [];

//   Массив кросс курсов валют
const arrCrossRateCurrency = [];
// ************

// Глобальные переменные для курсов валют
let inputValue = null;

// Переменные для кликов
// По дефолту рубли
let checkCurrencyInput = null;
let checkCurrencyCross = null;

// Получаем базу курсов валют
async function getCurrencyData() {
  // Список валют по ЦБ
  const rateCbrResp = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");

  //  Кросс курсы валют по ЦБ через USD
  const crossCbrResp = await fetch("https://cdn.cur.su/api/cbr.json");

  const rateCbrRespData = await rateCbrResp.json();
  const crossCbrRespData = await crossCbrResp.json();

  //   Передаем нужные ключи обьектов
  const rate = rateCbrRespData.Valute;
  const crossRate = crossCbrRespData.rates;

  arrCurrency(crossRate, rate);
}

// Собираем курсы валют, кросс курсы, коды стран и названия в массив
function arrCurrency(crossCurrency, rateCurrency) {
  //   Деструктурируем обьект значений курсов
  Object.entries(rateCurrency).map(([key, value]) => {
    arrRateCurrency.push({
      countryCode: key,
      dayliRate: value.Value.toFixed(2),
      previousRate: value.Previous.toFixed(2),
      countryName: value.Name,
    });
  });

  //   Деструктурируем обьект значений кросскурсов
  Object.entries(crossCurrency).map(([key, value]) => {
    arrCrossRateCurrency.push({
      countryCode: key,
      currencyDay: value,
    });
  });

  arrRateCurrency.map((elem, index) => {
    if (elem.countryCode === arrCrossRateCurrency[index].countryCode) {
      arrAllCurrency.push({
        countryCode: arrCrossRateCurrency[index].countryCode,
        currencyDay: elem.dayliRate,
        previousCurrency: elem.previousRate,
        crossRate: arrCrossRateCurrency[index].crossRate,
        countryName: elem.countryName,
      });
    }
  });

  filterCurrency();
}

//   Получаем список базовых валют по массиву baseCurrencyName
function filterCurrency() {
  arrAllCurrency.map((elem) => {
    if (baseCurrencyName.includes(elem.countryCode)) {
      arrBaseCurrency.push(elem);
    }
  });

  drowItemsBaseCurrency();
}

// Отрисовываем базовые валюты для приложения
function drowItemsBaseCurrency() {
  // Массив с правильным порядком валют
  let arrDrow = [
    arrBaseCurrency[5],
    arrBaseCurrency[4],
    arrBaseCurrency[3],
    arrBaseCurrency[0],
    arrBaseCurrency[2],
    arrBaseCurrency[1],
    arrCrossRateCurrency[34],
  ];

  arrDrow.map((elem) => {
    rateItemsInput.insertAdjacentHTML(
      "afterBegin",
      `<button  
      class="currency-body__input-btn" 
      value=${elem.currencyDay}>
      ${elem.countryCode}
      </button>
     `
    );

    rateItemsRate.insertAdjacentHTML(
      "afterBegin",
      `<button
      class="currency-body__rate-btn" 
      value=${elem.currencyDay}
      >
      ${elem.countryCode}
      </button> 
`
    );
  });

  // Отображаемый по дефолту курс при загрузке
  curseValueInput.innerHTML = `1 ${arrCrossRateCurrency[34].countryCode} = ${arrCrossRateCurrency[34].currencyDay} USD`;
}

//  Выбираем валюту для ввода
function handlerClickBtnInput(checkBtn) {
  const txtValue = checkBtn.target.innerText;
  const valueRate = checkBtn.target.value;

  checkCurrencyInput = valueRate;

  // Вставляем строчку с курсом в виджет ввода
  curseValueInput.innerHTML = `1 ${txtValue} = ${valueRate} RUB `;
}

//    Выбираем валюту для кросскурса
function handlerClickBtnRate(checkBtn) {
  const txtValue = checkBtn.target.innerText;
  const valueRate = checkBtn.target.value;

  // Вставляем строчку с курсом в виджет кросскурса
  curseValueRate.innerHTML = ` 1 ${txtValue} = ${valueRate} `;
}

// Обрабтываем ввод инпута, проверям что вводят только числа
function handlerInput(value) {
  console.log(arrCrossRateCurrency[34]);
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    inputValue = value;

    if (checkCurrencyInput === null) {
      checkCurrencyInput = arrCrossRateCurrency[34].currencyDay;
    }

    console.log(checkCurrencyInput * value);
  }
}

rateItemsInput.addEventListener("click", (click) =>
  handlerClickBtnInput(click)
);
rateItemsRate.addEventListener("click", (click) => handlerClickBtnRate(click));

inputCurse.addEventListener("input", (input) => {
  handlerInput(input.target.value);
});

getCurrencyData();
