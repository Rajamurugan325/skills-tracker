// CodePilot JS Demo Script
function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

const terms = 10;
console.log(`Calculating first ${terms} terms of Fibonacci sequence:`);
for (let i = 0; i < terms; i++) {
    console.log(`Term ${i}: ${calculateFibonacci(i)}`);
}