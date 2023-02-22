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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let html = `
   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

//creating a user name for each object
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€ `;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€ `;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€ `;
};

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
createUserName(accounts);
console.log(accounts);

let currentAccount;

const updateUI = acc => {
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //display movements
  displayMovements(acc.movements);
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = ` Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;

    //display ui
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputClosePin.blur();
    //update ui
    updateUI(currentAccount);
  }
});

// Transfer money

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    transferAcc &&
    transferAcc?.username !== currentAccount.username
  ) {
    transferAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    //update ui
    updateUI(currentAccount);
  }
});

//request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);

  const condition = currentAccount.movements.some(mov => mov >= 0.1 * loan);
  console.log(condition);

  if (loan > 0 && condition) {
    currentAccount.movements.push(loan);

    inputLoanAmount.value = '';
    //update UI
    updateUI(currentAccount);
  }
});

//close accounts

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => acc.pin === currentAccount.pin);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// "use strict";
// let arr = ["a", "b", "c", "d", "e"];

// //SLICE METHOD
// console.log(arr.slice(0));
// console.log(arr.slice(0, 3));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(0, -2));

// // SPLICE METHOD: this method mutates the  array itself
// //it is mostly used for deleting elements
// arr.splice(-1);
// console.log(arr);
// arr.splice(2);
// console.log(arr);

// //REVERSE METHOD : this also mutates the array
// arr = ["a", "b", "c", "d", "e"];
// const arr2 = ["l", "k", "j", "i", "h", "g", "f"];
// arr2.reverse();
// console.log(arr2);

// //CONCAT METHOD : does not mutate the array same as using the spread operators
// console.log(arr.concat(arr2));
// console.log([...arr2, ...arr]);
// console.log(arr);

// //JOIN METHOD : does not mutate the array

// console.log(arr.concat(arr2).join("-"));
// console.log([...arr, ...arr2].join("-"));
// console.log(arr);
// console.log(arr2); //remember arr2 was mutated by the reverse method

//the forEach method on  arrays and
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1} : you deposited ${movement}`);
//   } else if (movement < 0) {
//     console.log(`movement ${i + 1} : you withdraw ${Math.abs(movement)}`);
//   }
// }

// //using thhe forEach loop
// console.log('-----forEach-----');

// movements.forEach(function (movement, index, movements) {
//   if (movement > 0) {
//     console.log(`movement ${index + 1} : you deposited ${movement}`);
//   } else if (movement < 0) {
//     console.log(`movement ${index + 1} : you withdraw ${Math.abs(movement)}`);
//   }
// });

// //the forEach method on  maps and set
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, entrie) {
//   console.log(`the currency is ${value} : ${key}`);
// });

// //on sets
// const currenciesUnique = new Set(['USD', 'USD', 'GBP', 'EUR', 'GBP']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, entrie) {
//   console.log(`the currency is ${value} `);
// });

//THE FIND METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const withdrawedVal = movements.find(val => val < 0);
// console.log(withdrawedVal);

// //eg2

// const accountjd = accounts.find(account => account.username === 'jd');
// console.log(accountjd);

//USING THE FLAT METHOD TO GET THE TOTAL BALANCE OF ALL ACCOUNTS

//flat
// const allBalance = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);
// console.log(allBalance);

// //flat map
// const allBalance2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov) => acc + mov);
// console.log(allBalance2);

//USING THE Array.from method

// labelBalance.addEventListener('click', () => {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementUI);
// });
