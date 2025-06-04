let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["палка"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text p");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'палка', power: 5 },
  { name: 'кинжал', power: 30 },
  { name: 'палица', power: 50 },
  { name: 'меч', power: 100 }
];
const monsters = [
  {
    name: "Слизняк",
    level: 2,
    health: 15
  },
  {
    name: "Клыкастый зверь",
    level: 8,
    health: 60
  },
  {
    name: "Дракон",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "городская площадь",
    "button text": ["в магазин", "в пещеру", "принять бой"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Вы на городской площади. Вы видите вывеску с надписью \"Магазин\"."
  },
  {
    name: "магазин",
    "button text": ["Подлечиться (10 золотых)", "Купить оружие (30 золотых)", "Выйти на площадь"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Вы входите в магазин"
  },
  {
    name: "пещера",
    "button text": ["Слизняк", "Клыкастый зверь", "Вернуться на площадь"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Вы входите в пещеру и видите несколько чудовищ. Выбери с кем сразишься"
  },
  {
    name: "бой",
    "button text": ["Атаковать", "Увернуться", "Бежать"],
    "button functions": [attack, dodge, goTown],
    text: "Вы перед монстром, что будете делать?"
  },
  {
    name: "убить монстра",
    "button text": ["на площадь", "на площадь", "на площадь"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'Умирая, монстр кричит "Арг!". Вы получаете очки опыта и находите золото'
  },
  {
    name: "проиграть",
    "button text": ["ещё?", "ещё?", "ещё?"],
    "button functions": [restart, restart, restart],
    text: "Вы погибаете. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["ещё?", "ещё?", "ещё?"], 
    "button functions": [restart, restart, restart], 
    text: "Вы одолели монстра! УРА! &#x1F389;" 
  },
  {
    name: "пасхалка",
    "button text": ["2", "8", "На площадь?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Вы найшли секретную игру. Выберите число, указанное выше. Случайным образом будут выбраны десять чисел в диапазоне от 0 до 10. Если выбранное Вами число совпадает с одним из случайных чисел, Вы выигрываете!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Не хватает золотых для лечения";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Теперь у Вас " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " В вашем инвентаре есть: " + inventory;
    } else {
      text.innerText = "У Вас не достаточно золотых";
    }
  } else {
    text.innerText = "У вас уже есть самое мощное оружие!";
    button2.innerText = "Продайте оружие за 15 золотых";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Вы продали " + currentWeapon + ".";
    text.innerText += " В вашем арсенале: " + inventory;
  } else {
    text.innerText = "Не продавайте свое единственное оружие!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText =  monsters[fighting].name + " атакует.";
  text.innerText += " Вы атакуете, в руках у Вас " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Вы промахнулись.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Ваш " + inventory.pop() + " уже в хлам.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "На Вас движется " + monsters[fighting].name + " и Вы уворачиваетесь";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Вы выбрали " + guess + ". Здесь случайные номера:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Верно! Выигрыш 20 золотых!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Упс! Потеря здоровья 10!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}