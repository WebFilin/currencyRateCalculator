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

// Списко всех валют
const btnAllCurses = document.querySelector(".currency-body__all-currency-btn");
const drowAllCurrency = document.querySelector(
  ".currency-body__all-currency-wrapper"
);

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

// Глобальные переменные для курсов валют
let inputValue = null;

// Переменнные кросс курсов
let rateCurrencyCross = null;
let inputCurrencyCross = null;
let txtCurrencyCross = "";

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
  ];

  arrDrow.map((elem) => {
    rateItemsInput.insertAdjacentHTML(
      "afterBegin",
      `<button  
      class="currency-body__input-btn" 
      value=${elem.currencyDay}
      data-cross=${elem.crossRate}
      data-tooltip="${elem.countryName}"
      >
      ${elem.countryCode}
      </button>
     `
    );

    rateItemsRate.insertAdjacentHTML(
      "afterBegin",
      `<button
      class="currency-body__rate-btn" 
      value=${elem.currencyDay}
      data-cross=${elem.crossRate}
      data-tooltip= "${elem.countryName}"
      >
      ${elem.countryCode}
      </button> 
`
    );
  });

  // Отображаемый по дефолту курс при загрузке
  curseValueInput.innerHTML = `1 ${arrCrossRateCurrency[34].countryCode} = ${arrCrossRateCurrency[34].crossRate} USD`;
}

//  Выбираем валюту для ввода
function handlerBtnInput(checkBtn) {
  const txtValue = checkBtn.target.innerText;
  const valueRate = checkBtn.target.value;
  const cross = checkBtn.target.dataset.cross;
  let btnArr = document.querySelectorAll(".currency-body__input-btn");

  //   Передаем кросс курс
  inputCurrencyCross = cross;

  // Вставляем строчку с курсом в виджет ввода
  if (txtValue === "RUB") {
    curseValueInput.innerHTML = null;
  } else {
    curseValueInput.innerHTML = `1 ${txtValue} = ${valueRate} RUB `;
  }

  crossCurrency();
  drowCurrencyPair(txtValue, cross);
  removeClassBtn(btnArr);

  checkBtn.target.classList.add("btn_active");
}

//    Выбираем валюту для кросскурса
function handlerBtnRate(checkBtn) {
  const txtValue = checkBtn.target.innerText;
  const valueRate = checkBtn.target.value;
  const cross = checkBtn.target.dataset.cross;
  let btnArr = document.querySelectorAll(".currency-body__rate-btn");

  //   Выводим кросс курс
  rateCurrencyCross = cross;
  txtCurrencyCross = txtValue;
  //  Пересчитываем курс в зависимости от выбраного значения
  if (inputValue !== null) {
    drowInputCurse.innerHTML = Math.round(valueRate * inputValue);
  }

  // Вставляем строчку с курсом в виджет кросскурса
  if (inputCurrencyCross === null) {
    curseValueRate.innerHTML = `1 ${txtValue} = ${valueRate} RUB `;
  }

  crossCurrency();
  removeClassBtn(btnArr);

  checkBtn.target.classList.add("btn_active");
}

// Обрабтываем ввод инпута, проверям что вводят только числа
function handlerInput(value) {
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    inputValue = value;
    drowInputCurse.innerHTML = value;
  }

  //   Если инпут пуст то удаляем вывод курса
  if (value.trim().length === 0) {
    drowInputCurse.innerHTML = null;
  }
}

// Обрабатываем расчет кросскурса валютных пар
function crossCurrency() {
  let crossCurrency = (rateCurrencyCross / inputCurrencyCross) * inputValue;

  if (
    isFinite(crossCurrency) &&
    isFinite(rateCurrencyCross) &&
    isFinite(inputCurrencyCross)
  ) {
    drowInputCurse.innerHTML = ` ${Math.round(
      crossCurrency
    )} ${txtCurrencyCross}`;
  }
}

// Ображаем все курсы таблицей

function allCurrency(elemTarg) {
  drowAllCurrency.innerHTML = null;

  drowAllCurrency.classList.add("all-currency-active");

 

  arrAllCurrency.map((elem) => {
    drowAllCurrency.insertAdjacentHTML(
      "afterBegin",
      `<div
      class="currency-body__all-items" 
      data-tooltip-all="${elem.countryName}"
      >
      ${elem.countryCode} : ${elem.currencyDay} RUB
      </div> 
`
    );
  });
}

console.log(arrAllCurrency);

// Выводим значение кросс курса отностиельно доллара
function drowCurrencyPair(txtValue, cross) {
  curseValueRate.innerHTML = `1 USD = ${cross} ${txtValue}`;
}

// Очищаем стили кнопок при клике
function removeClassBtn(btn) {
  let btnArr = Array.from(btn);

  btnArr.forEach((elem) => {
    elem.classList.remove("btn_active");
  });
}

rateItemsInput.addEventListener("click", (click) => handlerBtnInput(click));
rateItemsRate.addEventListener("click", (click) => handlerBtnRate(click));

inputCurse.addEventListener("input", (input) => {
  handlerInput(input.target.value);
});

btnAllCurses.addEventListener("click", (click) => allCurrency(click));

getCurrencyData();
