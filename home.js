// ----------------- Quantity Increment / Decrement -----------------

let x = 1;
function button1() {
    document.getElementById('output-area').value = ++x;
}
function button2() {
    if (x > 1) {
        document.getElementById('output-area').value = --x;
    }
}
