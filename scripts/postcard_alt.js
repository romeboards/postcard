
    var MYLIB = function() {  
    var aPrivateProperty = true;
    var aPrivateMethod = function() {
        // some code here...
    };
    return {
        aPublicMethod : function() {
            aPrivateMethod(); // okay
            // some code here...
        },
        aPublicProperty : true
    };  
    }();

    MYLIB.aPrivateMethod() // not okay
    MYLIB.aPublicMethod() // okay