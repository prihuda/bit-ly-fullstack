"use strict";

function debugLine(message) {
    let e = new Error();
    let frame = e.stack.split("\n")[2];
    let lineNumber = frame.split(":")[1];
    let functionName = frame.split(" ")[5];
    //return functionName + ":" + lineNumber + " " + message;
		return frame + " " + message;
}

module.exports = debugLine;