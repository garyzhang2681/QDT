function getFullFileName(str) {
    var p = str.lastIndexOf('\\');
    return str.substr(++p, str.length - p);
};
function getFileName(str) {
    var p = str.lastIndexOf('.');
    return str.substr(0, p);
};
function getExtName(str) {
    var p = str.lastIndexOf('.');
    return str.substr(++p, str.length - p);
};