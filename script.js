'use strict';

//BANKIST APP
// Data

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};


const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');


const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'
        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${Math.abs(mov)}K.sh</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });

};


const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance}K.sh`;

};


const calcDisplaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}K.sh`

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}K.sh`

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100)
        .filter((int, i, arr) => {
            return int >= 1;

        })
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest}K.sh`
};



// Username
const creatUserNames = function(accs) {
    accs.forEach(function(acc) {
        acc.userName = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
creatUserNames(accounts);

const updateUi = function(acc) {
    displayMovements(acc.movements);

    // display balance
    calcDisplayBalance(acc);
    // display <summary></summary>
    calcDisplaySummary(acc);
}

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function(e) {
    //    prevent form from submitting 
    e.preventDefault();

    currentAccount = accounts.find(
        acc => acc.userName === inputLoginUsername.value);
    console.log(currentAccount);


    if (currentAccount.pin === Number(inputLoginPin.value)) {
        //display ui and welcome message
        labelWelcome.textContent = `welcome back,${currentAccount.owner.split(' ')[0]
    }`;
        containerApp.style.opacity = 100;
        //clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        // display movements

        updateUi(currentAccount);
    }
});
inputTransferAmount.value = inputTransferTo.value = '';

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.userName !== currentAccount.userName) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        updateUi(currentAccount);
    }
});

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value)

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        //add movement
        currentAccount.movements.push(amount);

        // update ui 
        updateUi(currentAccount);
    }
    inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) == currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

        //delete account
        accounts.splice(index, 1);

        //hide ui
        containerApp.style.opacity = 0;

    }
    inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})


labelBalance.addEventListener('click', function() {
    const movementsUi = Array.from(
        document.querySelectorAll('.movements__value'),
        el => Number(el.textContent.replace('K.sh', ''))
    )
});


// sorting
const owners = ['jonas', 'kakwiri', 'kabuda'];
console.log(owners.sort);

// does sorting based on strings 
// mutates the original array 


// for numbers we need to call a callback function with two parameters
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.sort((a, b) => {
        if (a > b)
            return -1;
        if (b > a)
            return 1;

    })
    // console.log(movements);
