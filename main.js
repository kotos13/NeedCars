// количество рандомных машин
const MAX_ENEMY = 7;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');

// добавление музыки вариант 1
// const music = document.createElement('embed');
// music.src = 'audio.mp3'
// скрытие элемента
// music.classList.add('visually-hidden');

// добавление музыки вариант 2
const music = new Audio('audio.mp3');
const accident = new Audio('accident.mp3');
// console.dir(music); поиск элемента


car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3  /*чем меньше значение трафика тем сложнее.меньше растояние*/
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame() {
  // добавление музыки 2
  music.play();
  // добавление музыки 1 
  // document.body.appen(music);
  // остановка музыки
  // setTimeout(() => {
  //   music.remove();
  // }, 3000);

  start.classList.add('hide');
  gameArea.innerHTML = ''; /*очистка игры*/
  // добавление линий
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  // добавление столбов
  for (let i = 0; i < getQuantityElements(100); i++) {
    const pillarLeft = document.createElement('div');
    pillarLeft.classList.add('pillarLeft');
    pillarLeft.style.top = (i * 100) + 'px';
    pillarLeft.y = i * 100;
    gameArea.appendChild(pillarLeft);
  }
  // добавление машин
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
    transparent
     url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
      center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  // установка авто на место
  // car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; /*автоматически*/
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';

  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed; /*уровень сложности*/
    score.innerHTML = 'ОЧКИ<br>' + setting.score; /*вывод текста очков*/
    moveRoad();
    movepillarLeft();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  }

}

function startRun(event) {
  // проверка чтоб не заполнялись лишние клавиши
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }

}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

// движение линий
function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }

  });
}

// движение столбов
function movepillarLeft() {
  let pillarLeft = document.querySelectorAll('.pillarLeft');
  pillarLeft.forEach(function (pillarLeft) {
    pillarLeft.y += setting.speed;
    pillarLeft.style.top = pillarLeft.y + 'px';

    if (pillarLeft.y >= document.documentElement.clientHeight) {
      pillarLeft.y = -100;
    }

  });
}
// движение машин
function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach(function (item) {
    // столкновение машин
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      // остановка игры
      setting.start = false;
      console.warn('ДТП');
      music.pause();
      accident.play();
      start.classList.remove('hide'); /* оставить на экране*/
      start.style.top = score.offsetHeight;
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }

  });
}

// число фибоначи
// const fibo = (n) => n <= 2 ? 1 : fibo(n - 1) + fibo(n - 2);
// console.log(fibo(10));