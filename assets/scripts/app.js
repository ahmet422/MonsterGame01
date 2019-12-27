const ATTACK_VALUE = 12;
const MONSTER_ATTACK_VALUE = 13;
const STRONG_ATTACK_VALUE = 15;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const HEAL_VALUE = 8;

let hasBonusLife = true;
let battleLog = [];

function getMaxValues(){
    let enteredValue = parseInt(prompt('Maximum life?','100'))
    const parsedValue = enteredValue;
    
    if(isNaN(parsedValue) || parsedValue<=0){
      throw {message:'Invalid User Input, not a number!'}
    }
    return parsedValue;
}
let chosenMaxLife;

try{
    chosenMaxLife = getMaxValues();
} catch(e){
    console.log(e);
    chosenMaxLife = 100;
  //  throw e;
} 


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
function writeToLog(ev,val,monsterHealth,playerHealth){
 let logEntry = {
    event : ev,
    value : val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
};
switch(ev){
    case LOG_EVENT_PLAYER_ATTACK:
        logEntry.target = 'MONSTER';
        break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry.target = 'MONSTER';
        break;
    case LOG_EVENT_MONSTER_ATTACK:
        logEntry.target = 'PLAYER';
        break;
    case LOG_EVENT_PLAYER_HEAL:
        logEntry.target = 'PLAYER';
        break;
    case LOG_EVENT_GAME_OVER:
        logEntry.status = 'Game Over';
        break;
    default:
        logEntry = [];
}
battleLog.push(logEntry);

}

adjustHealthBars(chosenMaxLife);

function attackHandler(){
 attackMonster(ATTACK_VALUE);
} 

function strongAttackHandler(){ 
    attackMonster(STRONG_ATTACK_VALUE);
}

function attackMonster(mode){
    const damage = dealMonsterDamage(mode);
    currentMonsterHealth = currentMonsterHealth - damage;
    endRound();
    mode = mode===ATTACK_VALUE ? LOG_EVENT_PLAYER_ATTACK:LOG_EVENT_PLAYER_STRONG_ATTACK;

    writeToLog(
        mode,
        damage,
        currentMonsterHealth,
        currentPlayerHealth);
 
}
function endRound(){
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth = currentPlayerHealth - playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth);
    if(currentPlayerHealth<=0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = currentMonsterHealth + 25;
        increasePlayerHealth(currentMonsterHealth); 
    } else if(currentMonsterHealth<=0 && currentPlayerHealth>0){
       alert("You Won");

       writeToLog(LOG_EVENT_GAME_OVER,
        'Winner is Player',
        currentMonsterHealth,
        currentPlayerHealth);
        reset();
   } else if(currentPlayerHealth<=0 && currentMonsterHealth>0){
        alert("You Lost");
       
        writeToLog(LOG_EVENT_GAME_OVER,
            'Winner is Monster',
            currentMonsterHealth,
            currentPlayerHealth);
        reset();
    } else if(currentMonsterHealth<=0 && currentPlayerHealth<=0){
        alert("Draw");
        
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'No winner just a draw',
            currentMonsterHealth,
            currentPlayerHealth);
        reset();
    }
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(100);
 
}
function healPlayer(){
    increasePlayerHealth(HEAL_VALUE); 
    currentPlayerHealth = currentPlayerHealth + HEAL_VALUE;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        HEAL_VALUE,
        currentMonsterHealth,
        currentPlayerHealth);
    endRound();
}
function printLogHandler(){
    for(let i = 0; i < 3; i++){
        console.log('----------------');
    }

    let i=0;
    for(const logEntry of battleLog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++;
    }
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayer);
logBtn.addEventListener('click',printLogHandler);