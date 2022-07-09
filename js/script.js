//Названия основные валюты
const baseCurrencyName = ["USD", "EUR", "GBP", "CNY", "JPY", "CHF"];

// Массив всех курсов валют
const arrAllCurrency = [];

// Базовые валюты для первичного отображения
const arrBaseCurrency = [];

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
  //   Массив курсов валют
  const arrRateCurrency = [];

  const arrCrossRateCurrency = [];

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
      crossRate: value,
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

  console.log(arrBaseCurrency);
}

getCurrencyData();
