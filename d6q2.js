const input = JSON.parse(require('fs').readFileSync('./d6q1.json').toString());
/*
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
    "K)YOU",
    "I)SAN",
];
*/
const orbits = {};

input.forEach(x => {
    const [a, b] = x.split(')');
    if (!orbits[b]) {
        orbits[b] = [];
    }
    orbits[b].push(a);
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

function bigTimeF__KYouCode____ia() {
    const you = orbits.SAN;
    const san = orbits.YOU;

    const visited = {YOU: true};
    const youPath = [];
    const sanPath = [];

    pathBasedF__KYouCode____ia("YOU", youPath);
    pathBasedF__KYouCode____ia("SAN", sanPath);

    console.log("San", sanPath);
    console.log("you", youPath);

    let lowestCAIdx = Number.MAX_VALUE;
    let lowestCA = null;
    youPath.forEach(p => {
        const idx = sanPath.indexOf(p);
        if (~idx && lowestCAIdx > idx) {
            lowestCAIdx = idx;
            lowestCA = p;
        }
    });

    const path = youPath.
        slice(2, youPath.indexOf(lowestCA)).
        concat(sanPath.slice(1, lowestCAIdx + 1).reverse());

    console.log(path);
    console.log(path.length);
}

function pathBasedF__KYouCode____ia(node, path) {
    if (node === "COM") {
        return true;
    }

    const children = orbits[node];
    let found = false;

    path.push(node);

    for (let i = 0; i < children.length && !found; ++i) {
        found = pathBasedF__KYouCode____ia(children[i], path);
    }

    if (!found) {
        path.pop();
    }

    return found;
}

bigTimeF__KYouCode____ia();
