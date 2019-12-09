/*
const input = JSON.parse(require('fs').readFileSync('./d6q1.json').toString());
*/
const input = [
    "COM)B",
    "B)C",
    "C)D",
    "D)E",
    "E)F",
    "B)G",
    "G)H",
    "D)I",
    "E)J",
    "J)K",
    "K)L",
    "L)YOU",
    "H)SAN",
];
const orbits = {};

input.forEach(x => {
    const [a, b] = x.split(')');
    if (!orbits[a]) {
        orbits[a] = [];
    }
    orbits[a].push(b);
});

const head = orbits.COM;
if (!head) {
    console.log("Z why you do this to me??", orbits);
}

let depthCount = 0;

function moustacheRideMeInSpace(node, depth = 0, visitedMap = {})  {

    if (!node) {
        return;
    }

    depth += 1;
    node.forEach(x => {
        if (visitedMap[x]) {
            return;
        }

        visitedMap[x] = true;
        depthCount += depth;
        moustacheRideMeInSpace(orbits[x], depth, visitedMap);
    });
}

console.log(moustacheRideMeInSpace(head), depthCount);

