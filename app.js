const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const canvasColor = document.getElementById("color");
const colorOptions = document.querySelectorAll(".color-option");
const test = document.getElementsByClassName("color-option");
console.log(`querySelectorAll : ${colorOptions}`);
console.log(`getElementsByClassName : ${test}`);

const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
// ctx = context의 약자, 자주 쓰이니까 ctx로 짧게 씀

canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = lineWidth.value;

let isPainting = false;
let isFilling = false;
let fillColor = "";

function onMove(e) {
  if (!isPainting) {
    ctx.moveTo(e.offsetX, e.offsetY);
  } else {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}
function onDown(e) {
  isPainting = true;
  onFillCanvas();
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
function onModeChange(e) {
  if (!isFilling) {
    isFilling = true;
    modeBtn.innerText = "Fill Mode";
  } else {
    isFilling = false;
    modeBtn.innerText = "Draw Mode";
  }
}

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
  modeBtn.innerText = "Draw Mode";
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onDown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
lineWidth.addEventListener("change", onLineWidthChange);
canvasColor.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeChange);
canvas.addEventListener("click", onCanvasClick);
destroyBtn.addEventListener("click", onDestroy);
eraserBtn.addEventListener("click", onEraserMode);

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
