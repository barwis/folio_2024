function textFromCharCode() {
    return console.log(String.fromCharCode.apply(null, arguments));
}
textFromCharCode(37, 99, 87, 97, 114, 110, 105, 110, 103);
