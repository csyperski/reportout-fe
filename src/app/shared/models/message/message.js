"use strict";
var Message = (function () {
    function Message(title, desc, errorMsg) {
        this.title = title;
        this.desc = desc;
        this.errorMsg = errorMsg;
    }
    return Message;
}());
exports.Message = Message;
