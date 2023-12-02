var varGroup = {
  startButton: null,
  changeButton: null,
  difficultyButton: null,
  difficultyDegree: 20,
  firstImage: null,
  secondImage: null,
  thirdImage: null,
  fourthImage: null,
  fifthImage: null,
  recoverButton: null,
  blank: { row: 4, col: 4 },
  index: 0,
  time: 0,
  timer: null,
  timeDiv: null,
  stack: [],
  map: new Array(),
  isPlaying: false,
  isRecover: false,
  stepNum: 0,
  stepDiv: null,
  charArr: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
  ],
  currentHoverElement: null,
};

var audio = new Audio("christmas.mp3");

window.onload = function () {
  init();
  varGroup.changeButton.onclick = function () {
    changeImage();
  };
  varGroup.startButton.onclick = function () {
    startGame();
  };
  varGroup.difficultyButton.onclick = function () {
    changeDifficulty();
  };
  varGroup.recoverButton.onclick = function () {
    recover();
  };
  varGroup.firstImage.onclick = function () {
    changeImage(0);
  };
  varGroup.secondImage.onclick = function () {
    changeImage(1);
  };
  varGroup.thirdImage.onclick = function () {
    changeImage(2);
  };
  varGroup.fourthImage.onclick = function () {
    changeImage(3);
  };
  varGroup.fifthImage.onclick = function () {
    changeImage(4);
  };

};

function init() {
  gameDiv = document.getElementById("game-div");
  varGroup.changeButton = document.getElementById("change");
  varGroup.startButton = document.getElementById("start");
  varGroup.timeDiv = document.getElementById("time-div");
  varGroup.difficultyButton = document.getElementById("difficulty");
  varGroup.stepDiv = document.getElementById("step-div");
  varGroup.recoverButton = document.getElementById("recover");
  varGroup.firstImage = document.getElementById("image-1");
  varGroup.secondImage = document.getElementById("image-2");
  varGroup.thirdImage = document.getElementById("image-3");
  varGroup.fourthImage = document.getElementById("image-4");
  varGroup.fifthImage = document.getElementById("image-5");
  changeImage();
}

function changeImage(index = 0) {
  if (varGroup.isRecover == true) return;
  varGroup.stack = [];
  varGroup.isPlaying = false;
  gameDiv.innerHTML = "";
  varGroup.blank.row = 4;
  varGroup.blank.col = 4;
  clearInterval(varGroup.timer);
  varGroup.time = 0;
  varGroup.stepNum = 0;
  varGroup.timeDiv.innerHTML = "0";
  varGroup.stepDiv.innerHTML = "0";
  for (var i = 0; i < 4; ++i) varGroup.map[i] = [];

  var frag = document.createDocumentFragment();

  if (varGroup.index >= 5) varGroup.index = 0;
  else {
	varGroup.index = index;
  }
  var number = 1;
  for (var i = 0; i < 4; ++i) {
    var rowArr = [];
    // Start with the number 1

    for (var j = 0; j < 4; ++j) {
      var imgDiv = document.createElement("div");
      imgDiv.className =
        "row-" +
        (i + 1) +
        " col-" +
        (j + 1) +
        " pic" +
        " b" +
        (varGroup.index + 1);
      imgDiv.id = "pic" + (i + 1) + "-" + (j + 1);
      imgDiv.value = varGroup.charArr[i * 4 + j];
      imgDiv.innerText = number;
      imgDiv.onclick = (function (i) {
        return function () {
          move(this, getPos(this));
        };
      })(i);
      imgDiv.onmouseenter = (function (i) {
        return function () {
          addFocus(this, getPos(this));
        };
      })(i);
      imgDiv.onmouseleave = (function (i) {
        return function () {
          removeFocus(this, getPos(this));
        };
      })(i);
      rowArr[j] = imgDiv;
      frag.appendChild(imgDiv);
      number++;
    }
    varGroup.map[i] = rowArr;
  }
  gameDiv.appendChild(frag);
}

function addFocus(id, pos) {
  if (varGroup.isPlaying == false) return;
  if (isPlayableElement(pos)) {
    varGroup.currentHoverElement = id.className;
    id.className += " hoverStyle";
  }
  return;
}

function isPlayableElement(pos) {
  return (
    ((pos.row + 1 == varGroup.blank.row || pos.row - 1 == varGroup.blank.row) &&
      pos.col == varGroup.blank.col) ||
    (pos.row == varGroup.blank.row &&
      (pos.col + 1 == varGroup.blank.col || pos.col - 1 == varGroup.blank.col))
  );
}

function removeFocus(id, pos) {
  if (varGroup.isPlaying == false) return;
  if (isPlayableElement(pos) && varGroup.currentHoverElement !== null) {
    id.className = varGroup.currentHoverElement;
    varGroup.currentHoverElement = null;
  }
}

function getPos(id) {
  var name = id.className;
  var row = name[name.indexOf("row-") + 4];
  var col = name[name.indexOf("col-") + 4];
  return {
    row: parseInt(row),
    col: parseInt(col),
  };
}

function move(id, pos) {
  if (varGroup.isPlaying == false) return;
  if (isPlayableElement(pos)) {
    id.className = varGroup.currentHoverElement;
    varGroup.currentHoverElement = null;
  }
  if (
    (pos.row + 1 == varGroup.blank.row || pos.row - 1 == varGroup.blank.row) &&
    pos.col == varGroup.blank.col
  ) {
	if (varGroup.blank.col === pos.col && (varGroup.blank.row-1) === pos.row) {
		id.className += " animte-up";
	} else if (varGroup.blank.col-1 === pos.col && (varGroup.blank.row) === pos.row) {
		id.className += " animte-right";
	} else if (varGroup.blank.col === pos.col && (varGroup.blank.row+1) === pos.row) {
		id.className += " animte-down";
	} else if (varGroup.blank.col+1 === pos.col && (varGroup.blank.row) === pos.row) {
		id.className += " animte-left";
	    }
    swapClassName(
      id,
      varGroup.map[varGroup.blank.row - 1][varGroup.blank.col - 1]
    );
    swapPosInArr(pos, varGroup.blank);
    pushStack();
    varGroup.blank.row = pos.row;
    varGroup.blank.col = pos.col;
    varGroup.stepNum++;
    varGroup.stepDiv.innerHTML = varGroup.stepNum;
  } else if (
    pos.row == varGroup.blank.row &&
    (pos.col + 1 == varGroup.blank.col || pos.col - 1 == varGroup.blank.col)
  ) {
	if (varGroup.blank.col === pos.col && (varGroup.blank.row-1) === pos.row) {
		id.className += " animte-up";
	} else if (varGroup.blank.col+1 === pos.col && (varGroup.blank.row) === pos.row) {
		id.className += " animte-right";
	} else if (varGroup.blank.col === pos.col && (varGroup.blank.row+1) === pos.row) {
		id.className += " animte-down";
	} else if (varGroup.blank.col-1 === pos.col && (varGroup.blank.row) === pos.row) {
		id.className += " animte-left";
	    }
    swapClassName(
      id,
      varGroup.map[varGroup.blank.row - 1][varGroup.blank.col - 1]
    );
    swapPosInArr(pos, varGroup.blank);
    pushStack();
    varGroup.blank.row = pos.row;
    varGroup.blank.col = pos.col;
    varGroup.stepNum++;
    varGroup.stepDiv.innerHTML = varGroup.stepNum;
  } else {
    return;
  }


  if (check()) {
    varGroup.isPlaying = false;

    // Add audio element with autoplay attribute

    audio.pause();
    varGroup.time = 0;
    varGroup.stepNum = 0;
    clearInterval(varGroup.timer);	
    audio.currentTime = 0;
    // Get the modal
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = "img/youwon.gif";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
      modalImg.src = "";
    };
  }
}

function pushStack() {
  var mapString = "";
  for (var i = 0; i < 4; ++i)
    for (var j = 0; j < 4; ++j) {
      mapString = mapString + varGroup.map[i][j].value;
    }
  var a = { row: varGroup.blank.row, col: varGroup.blank.col };
  var temp = {
    string: mapString,
    next: a,
  };
  varGroup.stack.push(temp);
}

function startGame() {
  with (varGroup) {
    if (isRecover == true) return;
    clearInterval(timer);
    time = 0;
    stepNum = 0;
    timeDiv.innerHTML = "0";
    stepDiv.innerHTML = "0";
    recoverButton.className = "green-button button";
    isPlaying = true;

    // Add audio element with autoplay attribute
    audio.loop = true;
    audio.play();

    timer = setInterval(function () {
      time++;
      timeDiv.innerHTML = time;
    }, 1000);
  }
  random();
}

function random() {
  with (varGroup) {
    var dirRow = [0, -1, 0, 1];
    var dirCol = [1, 0, -1, 0];

    for (var k = 0; k < difficultyDegree; ++k) {
      while (true) {
        var randomDir = Math.floor(Math.random() * 4);
        var NextRow = blank.row + dirRow[randomDir] - 1;
        var NextCol = blank.col + dirCol[randomDir] - 1;
        if (NextRow > 3 || NextRow < 0 || NextCol > 3 || NextCol < 0) {
          continue;
        } else {
          var target = { row: NextRow, col: NextCol };
          var mapString = "";
          for (var i = 0; i < 4; ++i)
            for (var j = 0; j < 4; ++j) {
              mapString = mapString + map[i][j].value;
            }
          var a = { row: blank.row, col: blank.col };
          var temp = {
            string: mapString,
            next: a,
          };
          var x;
          for (x = stack.length - 1; x >= 0; --x) {
            if (stack[x].string == temp.string) {
              var l = stack.length - 1 - x;
              for (var t = 0; t < l; ++t) stack.pop();
            }
          }
          if (x < 0) stack.push(temp);
          swap(target);
          break;
        }
      }
    }
    for (var i = 0; i < 4; ++i)
      for (var j = 0; j < 4; ++j) {
        map[i][j].className =
          "row-" + (i + 1) + " col-" + (j + 1) + " pic" + " b" + (index+1);
      }
  }
}

function swap(target) {
  var temp = varGroup.map[target.row][target.col];
  varGroup.map[target.row][target.col] =
  varGroup.map[varGroup.blank.row - 1][varGroup.blank.col - 1];
  varGroup.map[varGroup.blank.row - 1][varGroup.blank.col - 1] = temp;
  varGroup.blank.row = target.row + 1;
  varGroup.blank.col = target.col + 1;
}

function swapClassName(a, b) {
  var temp = a.className;
  a.className = b.className;
  b.className = temp;
}

function swapPosInArr(a, b) {
  var temp = varGroup.map[a.row - 1][a.col - 1];
  varGroup.map[a.row - 1][a.col - 1] = varGroup.map[b.row - 1][b.col - 1];
  varGroup.map[b.row - 1][b.col - 1] = temp;
}

function swapPos(a, b) {
  var tempRow = a.row,
    tempCol = a.col;
  a.row = b.row;
  a.col = b.col;
  b.row = tempRow;
  b.col = tempCol;
}

function check() {
  for (var i = 0; i < 4; ++i)
    for (var j = 0; j < 4; ++j) {
      if (varGroup.map[i][j].id != "pic" + (i + 1) + "-" + (j + 1))
        return false;
    }

  return true;

}


function changeDifficulty() {
  if (varGroup.difficultyDegree == 20) {
    varGroup.difficultyDegree = 100;
    varGroup.difficultyButton.innerHTML = "Difficult";
    varGroup.difficultyButton.className = "red-button button";
  } else {
    varGroup.difficultyDegree = 20;
    varGroup.difficultyButton.innerHTML = "Easy";
    varGroup.difficultyButton.className = "green-button button";
  }
}

function recover() {
  with (varGroup) {
    if (varGroup.isPlaying == false) {
      return;
    }
    varGroup.isRecover = true;
    varGroup.isPlaying = false;
    var i = varGroup.stack.length - 1;
    var timer2 = setInterval(function () {
      if (i < 0) {
        clearInterval(timer2);
        varGroup.isRecover = false;
        recoverButton.className = "gray-button button";
        if (check()) {
          varGroup.isPlaying = false;
          varGroup.time = 0;
          varGroup.stepNum = 0;
          clearInterval(varGroup.timer);
        }
        return;
      }
      var id =
        varGroup.map[varGroup.stack[i].next.row - 1][
          varGroup.stack[i].next.col - 1
        ];
      swapClassName(
        id,
        varGroup.map[varGroup.blank.row - 1][varGroup.blank.col - 1]
      );
      swapPosInArr(varGroup.stack[i].next, varGroup.blank);
      varGroup.blank.row = varGroup.stack[i].next.row;
      varGroup.blank.col = varGroup.stack[i].next.col;
      i--;
    }, 100);
  }
}
