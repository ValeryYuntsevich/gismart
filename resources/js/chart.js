
let description = [
  'Максимальная температура за месяц',
  'Минимальная температура за месяц',
  'Среднее значение температуры за месяц',
  'Медианное значение'
];

let btnAdd = document.querySelector('#add');
let btnSubstract = document.querySelector('#substract');
let blockChart = document.getElementById('chart');
let counter = makeCounter();
let counterChart = makeCounter();
let month = null;
let year = {
  months: []
};

btnAdd.addEventListener('click', () => {
  document.getElementById('description').innerHTML = description[counter(true)];
  getValue(counterChart(true));
});

btnSubstract.addEventListener('click', () => {
  document.getElementById('description').innerHTML = description[counter(false)];
  getValue(counterChart(false));
});

blockChart.addEventListener('mouseover', toggleTitleEnabled);
blockChart.addEventListener('mouseout', toggleTitleDisabled);

function toggleTitleEnabled(event) {
  if (event.target.className === 'month') {
    event.target.parentNode.children[0].style.opacity = 1;
  }
}

function toggleTitleDisabled(event) {
  if (event.target.className === 'month') {
    event.target.parentNode.children[0].style.opacity = 0;
  }
}

function disableBtn(status) {
  if (status == 'sub') {
    btnSubstract.classList.add('btn--disabled');
    btnSubstract.disabled = true;
  } else {
    btnAdd.classList.add('btn--disabled');
    btnAdd.disabled = true;
  }
}

function enableBtn(status) {
  if (status == 'sub') {
    btnSubstract.classList.remove('btn--disabled');
    btnSubstract.disabled = false;
  } else {
    btnAdd.classList.remove('btn--disabled');
    btnAdd.disabled = false;
  }
}

function makeCounter() {
  let count = 0;
  return function (status) {
    return status ? ++count : --count;
  }
}

function getValue(count) {
  switch (count) {
    case 0:
      disableBtn('sub');
      getMaxValue();
      break;
    case 1:
      enableBtn('sub');
      getMinValue();
      break;
    case 2:
      enableBtn('add');
      getAverageValue();
      break;
    case 3:
      disableBtn('add');
      getMedianValue();
      break;
    default:
      getMaxValue();
      break;
  }
}

function getMaxValue() {
  removeChart();

  for (let i = 0; i < year.months.length; i++) {
    let height = Math.max.apply(null, year[year.months[i]]);
    drawChart(height, year.months[i]);
  }
}

function getMinValue() {
  removeChart();

  for (let i = 0; i < year.months.length; i++) {
    let height = Math.min.apply(null, year[year.months[i]]);
    drawChart(height, year.months[i]);
  }
}

function getAverageValue() {
  removeChart();

  for (let i = 0; i < year.months.length; i++) {
    let height = (year[year.months[i]].reduce((a, b) => (a + b)) / year[year.months[i]].length).toFixed(2);
    drawChart(height, year.months[i]);
  }
}

function getMedianValue() {
  removeChart();

  for (let i = 0; i < year.months.length; i++) {
    let height = year[year.months[i]].sort(compareNumeric);
    if (year[year.months[i]].length % 2 == 0) {
      let a = height[year[year.months[i]].length / 2];
      let b = height[(year[year.months[i]].length / 2) - 1];
      drawChart(((a + b) / 2), year.months[i]);
    } else {
      let c = Math.round(year[year.months[i]].length / 2);
      drawChart(height[c], year.months[i]);
    }
  }
}

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

function removeChart() {
  while (blockChart.firstChild) {
    blockChart.removeChild(blockChart.firstChild);
  }
}

function drawChart(height, month) {
  let barChart = document.createElement('div');
  let barChartBlock = document.createElement('div');
  barChart.classList.add('month');
  barChartBlock.appendChild(drawText(height, month));
  barChartBlock.appendChild(barChart);

  if (height > 0) {
    barChart.style.height = height * 4 + 'px';
    document.querySelector('.chart').appendChild(barChartBlock);
  } else {
    barChart.style.height = Math.abs(height * 4) + 'px';
    barChart.style.position = 'relative';
    barChart.style.bottom = height * 4 + 'px';
    document.querySelector('.chart').appendChild(barChartBlock);
  }
}

function drawText(height, month) {
  let barText = document.createElement('span');
  barText.classList.add('title');
  barText.innerText = replaceNameMonth(month) + ' ' + height + '\u2103';

  if (height > 0) {
    return barText;
  } else {
    barText.style.position = 'relative';
    barText.style.bottom = height * 4 + 'px';
    return barText;
  }
}

function replaceNameMonth(month) {
  if (month.endsWith('я')) {
    if (month.length > 3) {
      return month.slice(0, month.length - 1) + 'ь';
    } else {
      return month.slice(0, month.length - 1) + 'й';
    }
  } else{
      return month.slice(0, month.length - 1);
  }
}

function loadJSON(callback) {
  const xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', 'resources/data/data.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
}

loadJSON(function (json) {
  json.map(data => {
    if (month != data.date.split(' ')[1]) {
      month = data.date.split(' ')[1];
      year.months.push(month);
      year[month] = [];
      year[month].push(+data.value);
    } else {
      year[month].push(+data.value);
    }
  });
  document.getElementById('description').innerHTML = description[0];
  getValue(0);
});