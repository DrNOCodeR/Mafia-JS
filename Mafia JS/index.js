const players = document.querySelectorAll('td');
const startbtn = document.getElementById('start-button');
const text = document.querySelector('.second');
const h1 = document.getElementById('header');

function startGame() {
  h1.textContent='Киясов МАФИЯ Гаджимурад';
  startbtn.textContent = 'НАЧАТЬ СНОВА';
  squad = createobjects()
  mynum = Math.floor(Math.random()*9); // от 0 до 8 [0,8]
  myrole = squad[mynum].role;
  text.innerHTML='';
  text.innerHTML+=`<p>Ваш игровой номер: ${mynum+1}. Ваша роль: ${myrole}.<br>Игра началась<br>Игроки познакомились</p>`;
  
  for (let i = 0; i<players.length;i++){
      players[i].innerHTML = `<img src="cover.jpg"> <br> ${i+1}`;
  }

  if (myrole==='мафия'){
    players[mynum].innerHTML = `<img src="mafia.jpg"> <br> ${mynum+1}`;
    let allies=[];
    for (let i = 0; i < 9; i++){
      if (squad[i].role === 'мафия'){
        players[i].innerHTML = `<img src="mafia.jpg"> <br> ${i+1}`;
        allies.push(i+1);
      }
    }
    allies = allies.filter(i => i!=mynum+1)
    text.innerHTML+=`<p>Ваши союзники: ${allies[0]} и ${allies[1]}.</p>`;
  }
  else if (myrole==='мирный'){
    players[mynum].innerHTML = `<img src="citizen.jpg"> <br> ${mynum+1}`;
  }
  
  countercitizen = squad.filter(i => i.isalive === true && i.role === "мирный").length; // количество живых мирных
  countermafia = squad.filter(i => i.isalive === true && i.role === "мафия").length; // количество живых мафий

  async function dayvote() {
    if ((countercitizen===countermafia) || (countermafia===0)){return}
    text.innerHTML+=`<p class="bol">Начинается голосование</p>`;
    votes = [0,0,0,0,0,0,0,0,0]
    for (let i = 0; i < 9; i++) {
      if (squad[i].isalive === true) {
        if (squad[i].id === mynum + 1) {
          await new Promise((resolve) => {
            setTimeout(() => {
              const a = prompt('Введите номер игрока, в которого хотите проголосовать');
              text.innerHTML += `<p>Игрок номер ${squad[i].id} <b>(ВЫ)</b> проголосовал в ${a}</p>`;
              votes[Number(a) - 1] += 1;
              resolve(); // Продолжаем выполнение цикла после ввода и подтверждения ответа
            }, 2000);
          });
        } else {
          while (true) {
            const vote = Math.floor(Math.random() * 9);
            if (squad[vote].isalive === true) {
              votes[vote] += 1;
              text.innerHTML += `<p>Игрок номер ${squad[i].id} проголосовал в ${vote + 1}</p>`;
              break;
            }
          }
        }
      }
    }
    text.innerHTML += `<p>По итогу голосования город казнил игрока номер ${votes.indexOf(Math.max(...votes)) + 1}</p>`;
    squad[votes.indexOf(Math.max(...votes))].isalive=false;
    if (squad[votes.indexOf(Math.max(...votes))].role==='мирный'){
      countercitizen-=1;
      players[votes.indexOf(Math.max(...votes))].innerHTML = `<img src="citizendead.jpg"> <br> ${votes.indexOf(Math.max(...votes)) + 1}`;
      text.innerHTML += `<b class="blue">Он оказался мирным жителем</b>`;
    }
    else if (squad[votes.indexOf(Math.max(...votes))].role==='мафия'){
      countermafia-=1;
      players[votes.indexOf(Math.max(...votes))].innerHTML = `<img src="mafiadead.jpg"> <br> ${votes.indexOf(Math.max(...votes)) + 1}`;
      text.innerHTML += `<b class="red">Он оказался мафией</b>`;
    }

    if ((countercitizen===countermafia) || (countermafia===0)){victory();return}

    // НОЧНОЕ ГОЛОСОВАНИЕ
    
    text.innerHTML += `<p>Наступает ночь, город засыпает<br>Мафия просыпается и выбирает свою жертву</p>`;
    newvotes=[0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < 9; i++) {
      if ((squad[i].isalive === true) && (squad[i].role==='мафия')) {
        if (squad[i].id === mynum + 1) {
          await new Promise((resolve) => {
            setTimeout(() => {
              const a = prompt('Введите номер игрока, в которого хотите выстрелить');
              text.innerHTML += `<p>Игрок номер ${squad[i].id} <b>(ВЫ)</b> выстрелил в ${a}</p>`;
              newvotes[Number(a) - 1] += 1;
              resolve(); // Продолжаем выполнение цикла после ввода и подтверждения ответа
            }, 2000);
          });
        } else {
          while (true) {
            const newvote = Math.floor(Math.random() * 9);
            if (squad[newvote].isalive === true && squad[newvote].role==='мирный') {
              newvotes[newvote] += 1;
              if (squad[mynum].role === 'мафия'){text.innerHTML += `<p>Игрок номер ${squad[i].id} выстрелил в ${newvote + 1}</p>`;}
              break;
            }
          }
        }
      }
    }
    text.innerHTML += `<p>Мафия засыпает<br>Город просыпается<br>Этой ночью убили игрока номер ${newvotes.indexOf(Math.max(...newvotes)) + 1}</p>`;
    squad[newvotes.indexOf(Math.max(...newvotes))].isalive=false;
    if (squad[newvotes.indexOf(Math.max(...newvotes))].role==='мирный'){
      countercitizen-=1;
      players[newvotes.indexOf(Math.max(...newvotes))].innerHTML = `<img src="citizendead.jpg"> <br> ${newvotes.indexOf(Math.max(...newvotes)) + 1}`;
      text.innerHTML += `<b class="blue">Он оказался мирным жителем</b>`;
    }
    else if (squad[newvotes.indexOf(Math.max(...newvotes))].role==='мафия'){
      countermafia-=1;
      players[newvotes.indexOf(Math.max(...newvotes))].innerHTML = `<img src="mafiadead.jpg"> <br> ${newvotes.indexOf(Math.max(...newvotes)) + 1}`;
      text.innerHTML += `<b class="red">Он оказался мафией</b>`;
    }
    if ((countercitizen===countermafia) || (countermafia===0)){victory();return}
  }
  
  async function check(){
    while((countercitizen!==countermafia) && (countermafia!==0)){await dayvote();}
  }

  check();
}

function victory(){
  if (countercitizen===countermafia){
    text.innerHTML+=`<br><b class="red">ПОБЕЖДАЕТ МАФИЯ</b>`;
    h1.textContent='ПОБЕДА МАФИИ';
    for (let i = 0; i<players.length;i++){
      if (players[i].innerHTML==`<img src="cover.jpg"> <br> ${i+1}`){
        if (squad[i].role=='мирный'){players[i].innerHTML=`<img src="citizen.jpg"> <br> ${i+1}`}
        else if (squad[i].role=='мафия'){players[i].innerHTML=`<img src="mafia.jpg"> <br> ${i+1}`}
      }
    }
  }
  else if (countermafia===0){
    text.innerHTML+=`<br><b class="blue">ПОБЕЖДАЮТ МИРНЫЕ</b>`;
    h1.textContent='ПОБЕДА МИРНЫХ';
    for (let i = 0; i<players.length;i++){
      if (players[i].innerHTML==`<img src="cover.jpg"> <br> ${i+1}`){
        if (squad[i].role=='мирный'){players[i].innerHTML=`<img src="citizen.jpg"> <br> ${i+1}`}
        else if (squad[i].role=='мафия'){players[i].innerHTML=`<img src="mafia.jpg"> <br> ${i+1}`}
      }
    }
  }
}

function createobjects(){
  let arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push('мафия');
  }

  for (let i = 0; i < 6; i++) {
    arr.push('мирный');
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  let ob = [];
  for(let i = 0; i < 9; i++){
    p = {
      id: i+1,
      isalive: true,
      role:arr[i],
    }
    ob.push(p)
  }
  return ob;
}