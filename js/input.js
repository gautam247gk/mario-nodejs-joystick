(function () {
  var pressedKeys = {};
  var host = window.document.location.host.replace(/:.*/, "");
  var ws = new WebSocket("ws://" + host + ":3000");
  function setKey(event, status) {
    var code = event.keyCode;
    console.log(event);
    var key;

    switch (code) {
      case 88:
        key = "SPACE";
        break;
      case 37:
        key = "LEFT";
        break;
      case 38:
        key = "UP";
        break;
      case 39:
        key = "RIGHT";
        break;
      case 40:
        key = "DOWN";
        break;
      case 32:
        key = "JUMP";
        break;
      case 82:
        key = "RUN";
        break;
      default:
        key = String.fromCharCode(code);
    }

    pressedKeys[key] = status;
  }

  // document.addEventListener("keydown", function (e) {
  //   setKey(e, true);
  //   // console.log(e);
  // });

  // document.addEventListener("keyup", function (e) {
  //   setKey(e, false);
  // });

  window.addEventListener("blur", function () {
    pressedKeys = {};
  });
  /////////////////socket receive////////////////////////////
  var lstatus = false,
    rstatus = false,
    ljstatus = false,
    rjstatus = false;
  ws.onmessage = function (message) {
    //console.log("data received from server:", message);
    var j, h;

    ///move right
    if (message.data == "50") {
      j = new KeyboardEvent("keydown", {
        code: "ArrowRight",
        keyCode: "39",
      });
      rstatus = true;
      setKey(j, true);
    } else if (message.data == "51" && rstatus) {
      j = new KeyboardEvent("keyup", {
        code: "ArrowRight",
        keyCode: "39",
      });
      rstatus = false;
      setKey(j, false);
    }

    ///move left
    if (message.data == "48") {
      j = new KeyboardEvent("keydown", {
        code: "ArrowLeft",
        keyCode: "37",
      });
      lstatus = true;
      setKey(j, true);
    } else if (message.data == "51" && lstatus) {
      j = new KeyboardEvent("keyup", {
        code: "ArrowLeft",
        keyCode: "37",
      });
      lstatus = false;
      setKey(j, false);
    }

    ///JUMMP
    if (message.data == "49") {
      j = new KeyboardEvent("keydown", {
        code: "Arrowup",
        keyCode: "32",
      });
      jstatus = true;
      setKey(j, true);
    } else if (message.data == "51" && jstatus) {
      j = new KeyboardEvent("keyup", {
        code: "Arrowup",
        keyCode: "32",
      });
      jstatus = false;
      setKey(j, false);
    }

    //left jump
    if (message.data == "51") {
      j = new KeyboardEvent("keydown", {
        code: "ArrowLeft",
        keyCode: "37",
      });
      h = new KeyboardEvent("keydown", {
        code: "Arrowup",
        keyCode: "32",
      });
      ljstatus = true;
      setKey(j, true);
      setKey(h, true);
    } else if (message.data == "52" && ljstatus) {
      j = new KeyboardEvent("keyup", {
        code: "ArrowLeft",
        keyCode: "37",
      });
      h = new KeyboardEvent("keyup", {
        code: "Arrowup",
        keyCode: "32",
      });
      ljstatus = false;
      setKey(j, false);
      setKey(h, false);
    }

    //right jump
    if (message.data == "53") {
      j = new KeyboardEvent("keydown", {
        code: "ArrowRight",
        keyCode: "39",
      });
      h = new KeyboardEvent("keydown", {
        code: "Arrowup",
        keyCode: "32",
      });
      rjstatus = true;
      setKey(j, true);
      setKey(h, true);
    } else if (message.data == "51" && rjstatus) {
      j = new KeyboardEvent("keyup", {
        code: "ArrowRight",
        keyCode: "39",
      });
      h = new KeyboardEvent("keyup", {
        code: "Arrowup",
        keyCode: "32",
      });
      rjstatus = false;
      setKey(j, false);
      setKey(h, false);
    }
  };

  window.input = {
    isDown: function (key) {
      return pressedKeys[key.toUpperCase()];
    },
    reset: function () {
      pressedKeys["RUN"] = false;
      pressedKeys["LEFT"] = false;
      pressedKeys["RIGHT"] = false;
      pressedKeys["DOWN"] = false;
      pressedKeys["JUMP"] = false;
    },
  };
})();
