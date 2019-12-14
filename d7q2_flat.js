const input = [
    0,
    0,
    0,
    0,
    0,
];

const reg26 = [
    5,
    4,
    3,
    2,
    1
];

for (let i = 0; i < 5; ++i) {
    // FIRST PART BABY
    input.forEach((v, i) => {
        input[(i + 1) % input.length] = v * 2 + reg26[i];
    });

    console.log("Inputs", input);
}

