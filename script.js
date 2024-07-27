// variable declarations
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const indicatorMsg = document.querySelector(".indicatorMsg");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set initial strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

//function to show password strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

//function to generate a random integer in range (min, max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    //generate lowercase character from ASCII code in range 97 - 123
    return String.fromCharCode(getRndInteger(97, 123))
}

function generateUpperCase() {
    //generate uppercase character from ASCII code in range 97 - 123
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
    //generate a random number and select that index from the symbols list
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//function to calculate the strength of the password
function CalculatePasswordStrength() {
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
        indicatorMsg.innerHTML = "Strong";
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
        indicatorMsg.innerHTML = "Medium";
    } else {
        setIndicator("#f00");
        indicatorMsg.innerHTML = "Weak";
    }

    indicatorMsg.classList.add("show");
}

//function to execute copying of password
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    //make the copied message invisible after 2s
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

//fucntion to Shuffle Password
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

    //create the password back from the array
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//fucntion to handle change in check boxes
function handleCheckBoxChange() {
    checkCount = 0;
    //for every change, check the total no of checked boxes
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition if passwordLength < checkCount
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    if (checkCount == 0) {
        generateBtn.classList.add("inactive");
    } else {
        if (generateBtn.classList.contains("inactive"))
            generateBtn.classList.remove("inactive");
    }
}

//add Event Listener to all checkboxes to count the no of checks
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//change length of password according to input slider value
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//execute copy content function when clicked on the 'copy' icon
copyBtn.addEventListener('click', () => {
    //should be able to copy iff a password is generated
    if (passwordDisplay.value)
        copyContent();
})

//generate a password when the button is clicked
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkCount == 0) {
        console.log("Sorry, Cant generate a Password of length 0!");
        return;
    }


    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    //array of functions
    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition of checked inputs in the password
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");
    console.log("Compulsory password is " + password);

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("Random Function Index" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    //shuffle the password before printing it to the UI
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calculate strength
    CalculatePasswordStrength();
});