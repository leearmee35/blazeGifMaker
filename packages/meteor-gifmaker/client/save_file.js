Meteor.saveFile = function(blob, name, path, type, callback) {
    console.log(blob)
    var reader  = new FileReader();
    if (blob) {
        reader.readAsDataURL(blob);
    }
    return reader
}