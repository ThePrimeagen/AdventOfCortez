const needle = 19690720;
const input = [
    3,225,1,225,6,6,1100,1,238,225,104,0,1101,37,61,225,101,34,121,224,1001,224,-49,224,4,224,102,8,223,223,1001,224,6,224,1,224,223,223,1101,67,29,225,1,14,65,224,101,-124,224,224,4,224,1002,223,8,223,101,5,224,224,1,224,223,223,1102,63,20,225,1102,27,15,225,1102,18,79,224,101,-1422,224,224,4,224,102,8,223,223,1001,224,1,224,1,223,224,223,1102,20,44,225,1001,69,5,224,101,-32,224,224,4,224,1002,223,8,223,101,1,224,224,1,223,224,223,1102,15,10,225,1101,6,70,225,102,86,40,224,101,-2494,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,1102,25,15,225,1101,40,67,224,1001,224,-107,224,4,224,102,8,223,223,101,1,224,224,1,223,224,223,2,126,95,224,101,-1400,224,224,4,224,1002,223,8,223,1001,224,3,224,1,223,224,223,1002,151,84,224,101,-2100,224,224,4,224,102,8,223,223,101,6,224,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,108,677,677,224,1002,223,2,223,1006,224,329,101,1,223,223,1107,677,226,224,102,2,223,223,1006,224,344,101,1,223,223,8,677,677,224,1002,223,2,223,1006,224,359,101,1,223,223,1008,677,677,224,1002,223,2,223,1006,224,374,101,1,223,223,7,226,677,224,1002,223,2,223,1006,224,389,1001,223,1,223,1007,677,677,224,1002,223,2,223,1006,224,404,1001,223,1,223,7,677,677,224,1002,223,2,223,1006,224,419,1001,223,1,223,1008,677,226,224,1002,223,2,223,1005,224,434,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,449,1001,223,1,223,1008,226,226,224,1002,223,2,223,1006,224,464,1001,223,1,223,1108,677,677,224,102,2,223,223,1006,224,479,101,1,223,223,1108,226,677,224,1002,223,2,223,1006,224,494,1001,223,1,223,107,226,226,224,1002,223,2,223,1006,224,509,1001,223,1,223,8,226,677,224,102,2,223,223,1006,224,524,1001,223,1,223,1007,226,226,224,1002,223,2,223,1006,224,539,1001,223,1,223,107,677,677,224,1002,223,2,223,1006,224,554,1001,223,1,223,1107,226,226,224,102,2,223,223,1005,224,569,101,1,223,223,1108,677,226,224,1002,223,2,223,1006,224,584,1001,223,1,223,1007,677,226,224,1002,223,2,223,1005,224,599,101,1,223,223,107,226,677,224,102,2,223,223,1005,224,614,1001,223,1,223,108,226,226,224,1002,223,2,223,1005,224,629,101,1,223,223,7,677,226,224,102,2,223,223,1005,224,644,101,1,223,223,8,677,226,224,102,2,223,223,1006,224,659,1001,223,1,223,108,677,226,224,102,2,223,223,1005,224,674,1001,223,1,223,4,223,99,226
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
function getValue(ptr, offsetCount) {
    let value = input[ptr + offsetCount];

    const offsetAmount = 10 ** (offsetCount - 1);
    const extraArgs = ~~(input[ptr] / 100);
    const high = ~~(extraArgs / offsetAmount);
    const mode = high % (offsetAmount * 10);

    if (mode === 0) {
        value = input[value];
    }
    output.push("  - getValue", offsetCount, mode, value, '\n');

    return value;
}

let outputIdx = 0;
let jmpAmount = 0;
let specialOutput = [];

function getOpCodeLength(opCode) {
    if (opCode < 2) {
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

outerLoop:
for (let i = 0; i < input.length && input[i] !== 99; i += jmpAmount) {
    const opCode = input[i] % 100;

    output.push(JSON.stringify(input.map((x, i) => [i, x])), '\n');
    output.push("opCode", i, input.slice(i, i + getOpCodeLength(opCode)), '\n');

    const a = getValue(i, 1);
    const b = getValue(i, 2);

    switch (opCode) {
        case 1:
        case 2:
            const o = opCode === 1 ? (a + b) : (a * b);
            output.push(" - add/mul", o, input[i + 3], '\n');

            if (input[i + 3] === 223) {
                specialOutput = specialOutput.concat(output.slice(output.length - 19));
            }

            input[input[i + 3]] = o;
            jmpAmount = 4;
            break;

        case 3:
            // TODO: BASED ON THE LAST LINE OF THE DUMB QUESTION
            const inputValue = 5;

            output.push(" -- setting input ", inputValue, '\n');
            input[input[i + 1]] = inputValue;
            jmpAmount = 2;
            break;

        case 4:
            console.log("Output: ", a);
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
            output.push("  - lessthan", a, b, input[i + 3]);
            input[input[i + 3]] = a < b ? 1 : 0;
            jmpAmount = 4;
            break;

        // equal
        case 8:
            output.push("  - equal", a, b, input[i + 3]);
            input[input[i + 3]] = a === b ? 1 : 0;
            jmpAmount = 4;
            break;

        case 99:
            console.log("99");
            break outerLoop;
        default:
            jmpAmount = 1;
            console.log("Invalid opcode\n");
    }
    specialOutput.push("Interesting Registers", input.slice(223, 226), '\n');

    console.log(output.join(' '));
    output = [];
}

