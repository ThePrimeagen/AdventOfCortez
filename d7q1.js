const needle = 19690720;
const programInput = [
    3,8,1001,8,10,8,105,1,0,0,21,42,67,84,109,122,203,284,365,446,99999,3,9,1002,9,3,9,1001,9,5,9,102,4,9,9,1001,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,4,9,102,3,9,9,101,3,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,5,9,9,4,9,99,3,9,102,5,9,9,101,5,9,9,102,3,9,9,101,3,9,9,102,2,9,9,4,9,99,3,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99
];

/*
const input = [
    1002,4,3,4,33
];
const input = [
    3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
];
*/

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

const possibleInputs = [0, 1, 2, 3, 4];

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

function runIntcode(buffer, inputArr, cb) {
    let inputIdx = 0;

    outerLoop:
    for (let i = 0; i < buffer.length && buffer[i] !== 99; i += jmpAmount) {
        const opCode = buffer[i] % 100;

        output.push(JSON.stringify(buffer.map((x, i) => [i, x])), '\n');
        output.push("opCode", i, buffer.slice(i, i + getOpCodeLength(opCode)), '\n');

        const a = getValue(buffer, i, 1);
        const b = getValue(buffer, i, 2);

        switch (opCode) {
            case 1:
            case 2:
                const o = opCode === 1 ? (a + b) : (a * b);
                output.push(" - add/mul", o, buffer[i + 3], '\n');

                if (buffer[i + 3] === 223) {
                    specialOutput = specialOutput.concat(output.slice(output.length - 19));
                }

                buffer[buffer[i + 3]] = o;
                jmpAmount = 4;
                break;

            case 3:
                const inputValue = inputArr[inputIdx++];

                output.push(" -- setting input ", inputValue, '\n');
                buffer[buffer[i + 1]] = inputValue;
                jmpAmount = 2;
                break;

            case 4:
                console.log("Output: ", a);
                cb(a);
                if (a !== 0) {
                    console.log(output.join(' '));
                }

                output = [];
                specialOutput = [];

                outputIdx = a;
                jmpAmount = 2;
                break;

            // jump if true
            case 5:
                output.push("  - jmpTrue", a);
                if (a) {
                    jmpAmount = b - i;
                }
                else {
                    jmpAmount = 3;
                }
                break;

            // jmp if false
            case 6:
                output.push("  - jmpFalse", a);
                if (a === 0) {
                    jmpAmount = b - i;
                }
                else {
                    jmpAmount = 3;
                }
                break;

            // lessthan
            case 7:
                output.push("  - lessthan", a, b, buffer[i + 3]);
                buffer[buffer[i + 3]] = a < b ? 1 : 0;
                jmpAmount = 4;
                break;

            // equal
            case 8:
                output.push("  - equal", a, b, buffer[i + 3]);
                buffer[buffer[i + 3]] = a === b ? 1 : 0;
                jmpAmount = 4;
                break;

            case 99:
                console.log("99");
                break outerLoop;
            default:
                jmpAmount = 1;
                throw new Error("Invalid opcode");
        }

        console.log(output.join(' '));
        output = [];
    }
}

function runTheDamnProgramTHEWIFE(programInput, buffer) {
    let lastValueOutputed = 0;
    function setLastValueOutputed(n) {
        lastValueOutputed = n;
    }

    buffer.forEach(x => {
        runIntcode(programInput.slice(0), [x, lastValueOutputed], setLastValueOutputed);
    });

    return lastValueOutputed;
}

let comboInputs = [];
generateComboList(possibleInputs, [], comboInputs);

console.log(comboInputs.reduce((a, b) => {
    const lastV = runTheDamnProgramTHEWIFE(programInput, b);
    return a > lastV ? a : lastV;
}, Number.MIN_VALUE));


