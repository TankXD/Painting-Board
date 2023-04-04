const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// ctx = context의 약자, 자주 쓰이니까 ctx로 짧게 씀
const lineWidth = document.getElementById("line-width");
const canvasColor = document.getElementById("color");
const colorOptions = document.querySelectorAll(".color-option");
const modeBtns = document.getElementById("mode-btns");
const modeBtnDraw = document.querySelector(".mode-btn__draw");
const modeBtnFill = document.querySelector(".mode-btn__fill");
const modeBtnEraser = document.querySelector(".mode-btn__eraser");
const modeBtnText = document.querySelector(".mode-btn__text");
const destroyBtn = document.getElementById("destroy-btn");
const fileInputBtn = document.getElementById("file");
const preview = document.getElementById("preview");
const previewImg = document.createElement("img");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");
const textSizeBtn = document.getElementById("text-size");
const textWeightBtn = document.getElementById("text-weight");

canvas.width = 600;
canvas.height = 600;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;
let isTexting = false;
let fillColor = "";
let textSize = "64px";
let textWeight = "bold";

let selectedBtn = null;

// ctx.fillStyle = "white";
// ctx.fillRect(0, 0, canvas.width, canvas.height);
// // 아무색으로도 배경을 칠하지 않은채로 download할 때 배경이 투명으로 되어있음
// // 배경을 칠한 후에 다운로드 하는 경우 상관없지만, 아예 칠하지 않고 다운로드하는 경우를 위해 흰색으로 미리 칠해줌

function onMove(e) {
  if (!isPainting) {
    ctx.moveTo(e.offsetX, e.offsetY);
  } else {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}
function onDown(e) {
  onTextCanvas(e);
  onFillCanvas();
  if (!isTexting) {
    isPainting = true;
  }
}

function cancelPainting() {
  ctx.beginPath();
  isPainting = false;
}

function onLineWidthChange(e) {
  ctx.lineWidth = e.target.value;
}

function saveFillColor() {
  fillColor = ctx.fillStyle;
}

function onTextCanvas(e) {
  if (isTexting) {
    const text = textInput.value;
    if (text !== "") {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = `${textWeight} ${textSize} serif`;
      ctx.fillText(text, event.offsetX, event.offsetY);
      console.log(ctx.font);
      ctx.restore();
    }
  }
}

function onFillCanvas() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function onColorChange(e) {
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
  saveFillColor();
}

function onColorClick(e) {
  const selectedColor = e.target.dataset.color;
  canvasColor.value = selectedColor;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  saveFillColor();
}

function onDrawMode() {
  isPainting = true;
  isFilling = false;
  isTexting = false;
}

function onFillMode() {
  isFilling = true;
  console.log(ctx.strokeStyle);
}
// function onModeChange(e) {
//   if (!isFilling) {
//     isFilling = true;
//     modeBtn.innerText = "Fill Mode";
//   } else {
//     isFilling = false;
//     modeBtn.innerText = "Draw Mode";
//   }
// }

function onCanvasClick() {
  if (isFilling) {
    onFillCanvas();
  }
}

function onDestroy() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fillColor;
}
function onEraserMode() {
  ctx.strokeStyle = "white";
  isFilling = false;
  isTexting = false;
  // modeBtn.innerText = "Draw Mode";
}

function onFileChange(event) {
  const file = event.target.files[0];
  // input file요소로 파일을 업로드한 경우 event.target.files에 정보가 들어감.
  // files가 배열인 이유는 input type="file"태그에서 multiple속성을 넣으면 파일을 여러개 넣을 수 있어서임.
  console.log(file);
  const url = URL.createObjectURL(file);
  // file의 URL을 String(문자열)로 반환해줌
  const image = document.createElement("img");
  // const image = new Image(); 와 같음
  image.src = url;
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    previewImg.src = url;
    preview.appendChild(previewImg);
    // fileInputBtn.value = null;
  });
  // 이미지가 로드된 경우 발생하는 이벤트
}

function onTextMode() {
  isTexting = true;
  isPainting = false;
  isFilling = false;
}

// function onDoubleClick(event) {
//   const text = textInput.value;
//   if (text !== "") {
//     ctx.save();
//     ctx.lineWidth = 1;
//     ctx.font = `${textWeight} ${textSize} serif`;
//     ctx.fillText(text, event.offsetX, event.offsetY);
//     console.log(ctx.font);
//     ctx.restore();
//   }
// }

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "ありがとうございます！";
  a.click();
}

function onTextSizeChange() {
  textSize = `${textSizeBtn.value}px`;
}

function onTextWeightChange() {
  if (textWeight === "bold") {
    textWeight = "normal";
    textWeightBtn.innerText = "Normal";
  } else {
    textWeight = "bold";
    textWeightBtn.innerText = "Bold";
  }
}

function onActiveBtn(e) {
  // 이미 선택된 버튼이 있는 경우
  if (selectedBtn) {
    // 이미 선택된 버튼과 새로 누른 버튼이 다르다면
    if (selectedBtn !== e.target) {
      // 이미 선택됬던 버튼의 active클래스 삭제
      selectedBtn.classList.remove("active");
      // 누른 타겟에 active클래스 할당
    }
  }
  e.target.classList.add("active");
  selectedBtn = e.target;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onDown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
lineWidth.addEventListener("change", onLineWidthChange);
canvasColor.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
// modeBtn.addEventListener("click", onModeChange);
modeBtns.addEventListener("click", onActiveBtn);

modeBtnDraw.addEventListener("click", onDrawMode);
modeBtnFill.addEventListener("click", onFillMode);
modeBtnEraser.addEventListener("click", onEraserMode);
modeBtnText.addEventListener("click", onTextMode);
// canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("click", onCanvasClick);
destroyBtn.addEventListener("click", onDestroy);
fileInputBtn.addEventListener("change", onFileChange);

saveBtn.addEventListener("click", onSaveClick);
textSizeBtn.addEventListener("change", onTextSizeChange);
textWeightBtn.addEventListener("click", onTextWeightChange);

// ctx.rect(50, 50, 100, 100);
// ctx.strokeStyle = "blue";
// ctx.stroke();
// // 여기부터 rect는 다른 rect, fill도 아래 rect만 적용됨.
// ctx.beginPath();
// ctx.rect(150, 150, 100, 100);
// ctx.fillStyle = "red";
// ctx.fill();

// ctx.fillStyle = "red";
// ctx.fillRect(50, 50, 100, 200);
// // 사각형 채우기
// ctx.strokeStyle = "blue";
// ctx.strokeRect(400, 500, 100, 200);
// // 사각형 만들기.
