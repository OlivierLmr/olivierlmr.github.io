// Global state containing the position of the object currently being moved.
var currentObject = null;
var currentObjetOffsetX = 0;
var currentObjetOffsetY = 0;

// Function that reacts to clicking anywhere on the screen
function mouseDownHandler(event) {
    // Get element at position of click
    var element = document.elementFromPoint(event.clientX, event.clientY);

    // If element exists and has class "editable", save as current object
    if (element && element.classList.contains("editable")) {
        currentObject = element;
        console.log("Object selected: " + currentObject)

        // Get offset between click position and object position
        currentObjetOffsetX = event.clientX - currentObject.offsetLeft;
        currentObjetOffsetY = event.clientY - currentObject.offsetTop;
    }
}

function mouseUpHandler(event) {
    // if there is a current object, reset current object
    if (currentObject) {
        // Log the object in its html format
        console.log(currentObject.outerHTML)

        // Put the object's html in the clipboard
        navigator.clipboard.writeText(currentObject.outerHTML)

        currentObject = null;
    }
}

// Function that reacts to mouse movement
function mouseMoveHandler(event) {
    if (currentObject) {
        // Get the object with class slides, there should only be one
        var parent = document.getElementsByClassName("slides")[0];
        // Create a regex that matches what is between the parentheses of "scale()" in the transform
        var regex = /scale\(([^ ]*?)\)/g;
        var s = parent.style.transform
        // get the string that matches the regex in s
        var match = regex.exec(s)[1];
        // If there is no transform, scale is 1
        if (match == "") {
            scale = 1;
            console.log("scale is 1")
        } else {
            // otherwise, parse the scale from string to float
            scale = parseFloat(match);
            console.log("scale is " + scale)
        }

        // Get the offset of the parent
        var parentOffsetX = parent.offsetLeft;
        var parentOffsetY = parent.offsetTop;

        // Move the object to the mouse position minus the offset, divided by the scale
        currentObject.style.left = ((event.clientX - currentObjetOffsetX) / scale) + "px";
        currentObject.style.top = ((event.clientY - currentObjetOffsetY) / scale) + "px";
    }
}

// Attach event listeners to the document when the user presses E
document.addEventListener("keydown", function (event) {
    // If the url contains localhost
    if ((window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")) && event.key == "e") {
        console.log("Editing mode activated.")
        document.addEventListener("mousedown", mouseDownHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        document.addEventListener("mousemove", mouseMoveHandler);
    } else {
        console.log("Editing mode disabled when not on localhost.")
    }
});