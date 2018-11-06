const run = require("./index");

const srcPath = process.argv[2];
const hashLen = process.argv[3];
run({ srcPath, hashLen });