let password = "";
let passwordLength = 10;
let checkBoxCount = 0;
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

const slider = document.querySelector("#slider");
const display = document.querySelector("[data-number]");

function handleSlider(){
    slider.value = passwordLength;
    display.innerText = passwordLength;

    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

handleSlider();
const indicator = document.querySelector("[data-indicator]");

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomNum(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomInt(){
    return getRandomNum(0,9);
}

function generateUpperCase(){
    return String.fromCharCode(getRandomNum(65,91));
}

function generateLowerCase(){
    return String.fromCharCode(getRandomNum(97,123));
}

function generateSymbol(){
    const idx = getRandomNum(0,symbols.length);
    return symbols.charAt(idx);
}

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
const passDisplay = document.querySelector("#Pass-display");
const copyMssg = document.querySelector("[data-copied]");

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMssg.innerText = "copied";
    }
    catch(e){
        copyMssg.innerText = "failed";
    }

    copyMssg.classList.add("active");

    setTimeout(() => {
        copyMssg.classList.remove("active");
    },2000);
}

slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

const copyBtn = document.querySelector("[data-copybutton]")

copyBtn.addEventListener('click',() => {
    if(passwordLength > 0){
        copyContent();
    }
});

const AllCheckBox = document.querySelectorAll('input[type=checkbox]');

function handleCheckBoxChange() {
    checkBoxCount = 0;
    AllCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkBoxCount++;
    });

    if(passwordLength < checkBoxCount ) {
        passwordLength = checkBoxCount;
        handleSlider();
    }
}


AllCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' ,handleCheckBoxChange);
})

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

const generator = document.querySelector("#generate");

generator.addEventListener('click', () => {
    if(checkBoxCount == 0)
        return;
    if(checkBoxCount > passwordLength){
        passwordLength = checkBoxCount;
        handleSlider();
    }
    password = "";
    let Arr = [];
    if(uppercaseCheck.checked)
        Arr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        Arr.push(generateLowerCase);
    if(numbersCheck.checked)
        Arr.push(generateRandomInt);
    if(symbolsCheck.checked)
        Arr.push(generateSymbol);
    for(let i=0;i<Arr.length;i++){
        password += Arr[i]();
    }
    for(let i=0; i<passwordLength-Arr.length; i++) {
        let randIndex = getRandomNum(0 , Arr.length);
        password += Arr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passDisplay.value = password;
    calcStrength();
});


