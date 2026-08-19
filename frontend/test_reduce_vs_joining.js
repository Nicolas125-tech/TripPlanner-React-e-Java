const strings = Array.from({ length: 5000 }, (_, i) => `field${i}: message ${i}`);

console.time('reduce');
for(let i=0; i<50; i++) {
  strings.reduce((acc, msg) => acc + "\n" + msg, "").trim();
}
console.timeEnd('reduce');

console.time('join');
for(let i=0; i<50; i++) {
  strings.join("\n").trim();
}
console.timeEnd('join');
