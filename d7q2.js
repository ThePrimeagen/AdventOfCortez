const EXIT = Number.MIN_SAFE_INTEGER;
const EXIT_MOD = Number.MIN_SAFE_INTEGER - 8;
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const needle = 19690720;
const programInput = [
    3,8,1001,8,10,8,105,1,0,0,21,42,67,84,109,122,203,284,365,446,99999,3,9,1002,9,3,9,1001,9,5,9,102,4,9,9,1001,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,4,9,102,3,9,9,101,3,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,5,9,9,4,9,99,3,9,102,5,9,9,101,5,9,9,102,3,9,9,101,3,9,9,102,2,9,9,4,9,99,3,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99
];

const input = [
    3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
    -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
    53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
];

/*
const input = [
    3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
];
*/

function questionTime(qCount) {
    return new Promise(res => {
        rl.question(`press enter ${qCount}`, (answer) => {
            res();
        });
    });
}

let output = [];
function getValue(buffer, ptr, offsetCount) {
    let value = buffer[ptr + offsetCount];

    const mode = ~~(~~(buffer[ptr] / 100) / 10 ** (offsetCount - 1)) % (10 ** (offsetCount - 1) * 10);
    if (mode === 0) {
        value = buffer[value];
    }
    output.push("  - getValue", mode, value, '\n');

    return value;
}

function generateComboList(inputs, currentList, outputs) {
    if (inputs.length === 0) {
        outputs.push(currentList.slice(0));
    }

    for (let i = 0; i < inputs.length; ++i) {
        const nextArr = inputs.slice();
        currentList.push(nextArr.splice(i, 1)[0]);
        generateComboList(nextArr, currentList, outputs);
        currentList.pop();
    }
}

let inputIdx = 0;
let largestOutput = Number.MIN_VALUE;
let lastOutput = 0;
let jmpAmount = 0;
let specialOutput = [];

function getOpCodeLength(opCode) {
    if (opCode < 3) {
        return 4;
    }
    else if (opCode < 5) {
        return 2;
    }
    return 4;
}

function prettyString(a, b) {
    return a.map((x, i) => {
        const aStr = String(x);
        const bStr = String(b[i]);
        if (aStr.length >= bStr.length) {
            return aStr;
        }
        else {
            return new Array(bStr.length - aStr.length).fill(' ') + aStr;
        }
    });
}

function getOptiCodeName(opCode) {
    switch (opCode) {
        case 1:
            return 'add';
        case 2:
            return 'mul';
        case 3:
            return 'input';
        case 4:
            return 'output';
        case 5:
            return 'jmptrue';
        case 6:
            return 'jmpfalse';
        case 7:
            return 'lessthan';
        case 8:
            return 'equal';
        case 99:
            return 'exit';
        default:
            return 'unknown';
    }

    // say it like trump
    return 'opti-worst-mod-ever.';
}

function runInst(state) {
    state.output = undefined;
    state.halted = false;

    const vpc = state.vpc;
    const buffer = state.buffer;
    const logs = state.logs = [];
    const opCode = state.opCode = buffer[vpc] % 100;
    const inputArr = state.inputs;

    const a = state.a = getValue(buffer, state.vpc, 1);
    const b = state.b = getValue(buffer, state.vpc, 2);

    logs.push(JSON.stringify(buffer.map((x, i) => [i, x])), '\n');
    const logBuf = buffer.slice(state.vpc, state.vpc + getOpCodeLength(opCode));
    logs.push("opCode", state.vpc, logBuf, getOptiCodeName(opCode), '\n');

    switch (opCode) {
        case 1:
        case 2:
            const o = opCode === 1 ? (a + b) : (a * b);
            logs.push(" - add/mul", o, buffer[state.vpc + 3], '\n');
            buffer[buffer[state.vpc + 3]] = o;
            state.vpc += 4;
            break;

        case 3:
            const inputValue = inputArr.shift();
            logs.push(` -- setting input.shift() = ${inputValue} ${JSON.stringify(inputArr)} \n`);
            buffer[buffer[state.vpc + 1]] = inputValue;
            state.vpc += 2;
            break;

        case 4:
            state.vpc += 2;
            state.output = a;
            break;

        // jump if true
        case 5:
            logs.push("  - jmpTrue", a);
            if (a) {
                state.vpc += b - state.vpc;
            }
            else {
                state.vpc += 3;
            }
            break;

        // jmp if false
        case 6:
            logs.push("  - jmpFalse", a);
            if (a === 0) {
                state.vpc += b - state.vpc;
            }
            else {
                state.vpc += 3;
            }
            break;

        // lessthan
        case 7:
            logs.push("  - lessthan", a, b, buffer[state.vpc + 3]);
            buffer[buffer[state.vpc + 3]] = a < b ? 1 : 0;
            state.vpc += 4;
            break;

        // equal
        case 8:
            logs.push("  - equal", a, b, buffer[state.vpc + 3]);
            buffer[buffer[state.vpc + 3]] = a === b ? 1 : 0;
            state.vpc += 4;
            break;

        case 99:
            state.halted = true;
            break;

        default:
            state.badInstruction = true;
            break;
    }
}

// Here is part of the eq.
// A: I0 - 4
// B: (I1 * 2)
//

// TODO: Provide each amplifer its phase setting at its first input.... yikes.
async function runTheDamnProgramTHEWIFE(programInput, buffer) {
    const opts = {
        exitOnOutput: true,
        pauseEachLoop: false,
        log: false,
    };

    // This will not feedback
    const states = buffer.map((x, i) => {
        let D = i + 8;
        const inputs = [buffer[i]];
        if (8===D) {
            inputs.push(0);
        }

        return {
            buffer: programInput.slice(0),
            inputs,
            vpc: 0
        };
    });

    console.log("Starting the loop");

    let prev = null;
    let output = 0;
    do {
        for (let i = 0; i < states.length; ++i) {
            console.log("State", String.fromCharCode(i + 'a'.charCodeAt(0)));
            const state = states[i];
            const a = [];

            if (prev) {
                state.inputs.push(prev.output);
            }

            do {
                runInst(state);

                if (opts.log) {
                    console.log(state.logs.join(' '));
                }

                if (opts.pauseEachLoop) {
                    await questionTime(i);
                }

                if (state.output !== undefined) {
                    output = state.output;
                    if (opts.exitOnOutput) {
                        break;
                    }
                }

            } while (!state.halted);

            prev = state;
        }

        if (opts.pauseEachLoop) {
            await questionTime(42);
        }
    } while (!prev.halted);

    return output;
}

async function run() {
    const possibleInputs = [5, 6, 7, 8, 9];

    let comboInputs = [];
    generateComboList(possibleInputs, [], comboInputs);

    /*
    comboInputs = [
        [9,7,8,5,6]
    ];
    */

    let largestValue = Number.MIN_VALUE;
    for (let i = 0; i < comboInputs.length; ++i) {
        const combo = comboInputs[i];
        const out = await runTheDamnProgramTHEWIFE(programInput, combo);

        if (out > largestValue) {
            largestValue = out;
        }
    }

    return largestValue;
}

run().then(console.log);


