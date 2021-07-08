Module.noInitialRun = true;
Module['print'] = function(text) {
        return function(text) {
                Module.usher_output += '\n'+text;
        }
}();
Module['printErr'] = function(text) {
        return function(text) {
                Module.usher_err += '\n'+text;
        }
}();