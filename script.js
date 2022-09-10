'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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




/*
// filter method 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function(mov) {
        return mov > 0;

    })
    // console.log(deposits);

const withdrawals = movements.filter(function(mov) {
        return mov < 0;
    })
    // console.log(withdrawals);


// REDUCE METHOD 
const balance = movements.reduce(function(acc, curr, i, arr) {
    return acc + curr
}, 0);
console.log(balance);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES





/////////////////////////////////////////////////


// ARRAYS
/*

// Slice method 
// does not mutate the original array 
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice());
console.log(arr.slice(...arr)); //spread that performs slice without mutating the main array

// Splice method
// works in the same way as slice method but changes the main array and mutates it 
// used to remove elements from an array 
console.log(arr.splice(2));
console.log(arr);

// reverse method 
// it revesrse the array 
// it mutates the array and saves the changes permanantly on the array
const arr2 = ['k', 'h', 'l', 'o', 's'];
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr2);
console.log(arr2.reverse());

// Concat method
// Used to concatinate two arrays
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); //spread that concatinates without mutating the main array


// Join method
console.log(letters.join('*'));

// Other Methods
// Push method
// Pop method 
// index of method
*/



// for each loop
/*
// implimenting a loop using for statement 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const movement of movements) {
    if (movement > 0) {
        console.log(`You have deposited ${movement}`);
    } else {
        console.log(`You withdrew ${Math.abs(movement)}`);
    }
}
console.log('====KAKWIRI====');
// implimenting the same loop using for each method 
// for each does not support break and continues
movements.forEach(function(movement, i, arr) {
    if (movement > 0) {
        console.log(`Movement ${i+1}: You have deposited ${movement}`);
    } else {
        console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`);
    }

});
*/

/*
//for each
// Map 
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
    console.log(`${key}: ${value}`);
})
*/
/*
// THE FIND METHOD ?
const firstWithdrawal = movements.find(mov => mov < 0)
console.log(movements);
console.log(firsWithdrawal);

// the find method returns the first element that satisfy the condition 
// filter returns all the element tha t satisfy the conditions
*/

/*
// INCLUDES METHOD 
// checks if the number specified is in the Array...returns a bolean 
console.log(movements);
console.log(movements.includes(-130));
// if -130 is in the movements aaray then  true is returned
tests for equality
*/

// SOME METHOD 
//similar to includes method 
// tests for a condition


// EVERY METHOd
// returns a true value when all the elements satisfy the specific condition


// Flat method

// in a nested Array, the flat method returns all the arrays as a single array ***for one level deep(1)
// const arr = [
// [1, 2, 3],
// [4, 5, 6], 78
// ];
// console.log(arr.flat());



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