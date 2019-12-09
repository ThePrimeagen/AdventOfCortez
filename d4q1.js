/*
 * It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
*/
function isCorrect(num) {
    const nums = ("" + num).split('');

    let rep = false;
    let prev = nums[0];
    let ordered = true;

    for (let i = 1; i < nums.length && ordered; prev = nums[i++]) {
        ordered = nums[i] >= prev;
        rep = rep || prev === nums[i];
    }
    return rep && ordered;
}

let count = 0;
for (let i = 248345; i < 746315; ++i) {
    isCorrect(i) && count++;
}

console.log(count);

console.log('PRIME LOVES RUST')