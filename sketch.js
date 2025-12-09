let runSheet, walkSheet, jumpSheet;
let runFrames = [], walkFrames = [], jumpFrames = [];
let currentFrame = 0;
let runFramesLoaded = false, walkFramesLoaded = false, jumpFramesLoaded = false;

let aSheet, bSheet, cSheet;
let aFrames = [], bFrames = [], cFrames = [];
let aFramesLoaded = false, bFramesLoaded = false, cFramesLoaded = false;

let char3aSheet, char3bSheet, char3cSheet;
let char3aFrames = [], char3bFrames = [], char3cFrames = [];
let char3aFramesLoaded = false, char3bFramesLoaded = false, char3cFramesLoaded = false;

// 遊戲狀態管理
let gameState = 'IDLE'; // IDLE, QUESTION_MATH, QUESTION_F1, CORRECT, INCORRECT
let character2Dialogue = '';
let currentQuestion;
let answerInput, submitButton;

// 題庫
let mathQuestionsTable;
let f1QuestionsTable;

let character2State = 'a'; // 'a', 'b', 'c'
let character3State = 'a'; // 'a', 'b', 'c'

// 角色狀態: 'idle' (靜止), 'running', 'walking', 'jumping'
let characterState = 'idle'; 

// 角色位置、速度和方向
let characterX;
let characterY;
let characterSpeed = 3; // 角色移動速度
let characterDirection = 1; // 1 表示向右，-1 表示向左
// 跑步動畫的參數 ('跑.png')
const runSheetWidth = 810;  // 總寬度 (162px * 5)
const runSheetHeight = 177; // 總高度
const runFrameCount = 5;    // 畫格數量
const runFrameWidth = runSheetWidth / runFrameCount;

// 走路動畫的參數 ('走.png')
const walkSheetWidth = 618; // 修正: 103px * 6 frames
const walkSheetHeight = 188;
const walkFrameCount = 6;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跳躍動畫的參數 ('跳.png')
const jumpSheetWidth = 1932; // 修正: 138px * 14 frames
const jumpSheetHeight = 212;
const jumpFrameCount = 14;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

// a.png 動畫的參數
const aSheetWidth = 165;
const aSheetHeight = 63;
const aFrameCount = 5;
const aFrameWidth = aSheetWidth / aFrameCount;
const aScale = 1.5; // 角色二 (a.png) 的放大比例

// b.png 動畫的參數
const bSheetWidth = 165;
const bSheetHeight = 63;
const bFrameCount = 5;
const bFrameWidth = bSheetWidth / bFrameCount;

// c.png 動畫的參數
const cSheetWidth = 99; // 實際寬度 (33px * 3)
const cSheetHeight = 63;
const cFrameCount = 3; // 實際畫格數為 3
const cFrameWidth = cSheetWidth / cFrameCount;

// 角色三 (4/a.png) 動畫的參數 (請根據您的圖片修改)
const char3SheetWidth = 231;  // 實際寬度 (33px * 7)
const char3SheetHeight = 28;   // 實際高度
const char3FrameCount = 7;     // 實際畫格數
const char3FrameWidth = char3SheetWidth / char3FrameCount;
const char3Scale = 1.5; // 角色三的放大比例

// 角色三 (4/b.png) 答對動畫參數 (假設)
const char3bSheetWidth = 231;
const char3bSheetHeight = 28;
const char3bFrameCount = 7;
const char3bFrameWidth = char3bSheetWidth / char3bFrameCount;

// 角色三 (4/c.png) 答錯動畫參數 (假設)
const char3cSheetWidth = 99;
const char3cSheetHeight = 28;
const char3cFrameCount = 3;
const char3cFrameWidth = char3cSheetWidth / char3cFrameCount;


// a.png 的位置
let aX, aY;

// 角色三的位置
let char3X, char3Y;

function preload() {
  // 同時載入跑步和走路的圖片
  runSheet = loadImage('2/跑.png');
  walkSheet = loadImage('2/走.png');
  jumpSheet = loadImage('2/跳.png');
  aSheet = loadImage('1/a.png'); // 載入 a.png
  bSheet = loadImage('1/b.png'); // 載入 b.png
  cSheet = loadImage('1/c.png'); // 載入 c.png
  char3aSheet = loadImage('4/a.png'); // 載入角色三 (狀態a)
  char3bSheet = loadImage('4/b.png'); // 載入角色三 (狀態b)
  char3cSheet = loadImage('4/c.png'); // 載入角色三 (狀態c)

  // 載入題庫 CSV 檔案
  mathQuestionsTable = loadTable('math_questions.csv', 'csv', 'header');
  f1QuestionsTable = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  // 讓圖片繪製的基準點在圖片的中心，方便置中
  imageMode(CENTER);
  // 初始化角色位置在畫面中央
  characterX = width / 2;
  characterY = height / 2;

  // 設定 a.png 的初始位置在角色旁邊
  aX = characterX + 150;
  aY = characterY;

  // 設定角色三的初始位置在角色左邊
  char3X = characterX - 150;
  char3Y = characterY;

  // --- 畫格切割 ---
  // 由於圖片在 preload() 中載入，setup() 開始時必定已載入完成
  // 所以可以直接進行切割

  // 切割跑步畫格
  if (runSheet) {
    for (let i = 0; i < runFrameCount; i++) {
      let frame = runSheet.get(i * runFrameWidth, 0, runFrameWidth, runSheetHeight);
      runFrames.push(frame);
    }
    runFramesLoaded = true;
  }
  // 切割走路畫格
  if (walkSheet) {
    for (let i = 0; i < walkFrameCount; i++) {
      let frame = walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSheetHeight);
      walkFrames.push(frame);
    }
    walkFramesLoaded = true;
  }
  // 切割跳躍畫格
  if (jumpSheet) {
    for (let i = 0; i < jumpFrameCount; i++) {
      let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpSheetHeight);
      jumpFrames.push(frame);
    }
    jumpFramesLoaded = true;
  }
  // 切割 a.png 畫格
  if (aSheet) {
    for (let i = 0; i < aFrameCount; i++) {
      let frame = aSheet.get(i * aFrameWidth, 0, aFrameWidth, aSheetHeight);
      aFrames.push(frame);
    }
    aFramesLoaded = true;
  }
  // 切割 b.png 畫格
  if (bSheet) {
    for (let i = 0; i < bFrameCount; i++) {
      let frame = bSheet.get(i * bFrameWidth, 0, bFrameWidth, bSheetHeight);
      bFrames.push(frame);
    }
    bFramesLoaded = true;
  }
  // 切割 c.png 畫格
  if (cSheet) {
    for (let i = 0; i < cFrameCount; i++) {
      let frame = cSheet.get(i * cFrameWidth, 0, cFrameWidth, cSheetHeight);
      cFrames.push(frame);
    }
    cFramesLoaded = true;
  }
  // 切割 角色三 畫格
  if (char3aSheet) {
    for (let i = 0; i < char3FrameCount; i++) {
      let frame = char3aSheet.get(i * char3FrameWidth, 0, char3FrameWidth, char3SheetHeight);
      char3aFrames.push(frame);
    }
    char3aFramesLoaded = true;
  }
  if (char3bSheet) {
    for (let i = 0; i < char3bFrameCount; i++) {
      let frame = char3bSheet.get(i * char3bFrameWidth, 0, char3bFrameWidth, char3bSheetHeight);
      char3bFrames.push(frame);
    }
    char3bFramesLoaded = true;
  }
  if (char3cSheet) {
    for (let i = 0; i < char3cFrameCount; i++) {
      let frame = char3cSheet.get(i * char3cFrameWidth, 0, char3cFrameWidth, char3cSheetHeight);
      char3cFrames.push(frame);
    }
    char3cFramesLoaded = true;
  }
}

function draw() {
  // 設定背景顏色
  background(255);

  // 確保角色所有畫格都已載入完成
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded && aFramesLoaded && bFramesLoaded && cFramesLoaded && char3aFramesLoaded && char3bFramesLoaded && char3cFramesLoaded) {
    let currentAnimationFrames;
    let currentFrameWidth;
    let animationSpeed;
    let currentFrameImage;

    // 根據角色狀態更新位置和動畫
    if (characterState === 'running') {
      currentAnimationFrames = runFrames;
      currentFrameWidth = runFrameWidth;
      animationSpeed = 4;
      currentFrameImage = runFrames[currentFrame];
      // 跑步時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'walking') {
      currentAnimationFrames = walkFrames;
      currentFrameWidth = walkFrameWidth;
      animationSpeed = 6;
      currentFrameImage = walkFrames[currentFrame];
      // 走路時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'jumping') {
      currentAnimationFrames = jumpFrames;
      currentFrameWidth = jumpFrameWidth;
      animationSpeed = 5; // 跳躍動畫速度
      currentFrameImage = jumpFrames[currentFrame];
      // 跳躍時角色位置保持不變
    } else { // 'idle' 狀態
      currentAnimationFrames = walkFrames; // 靜止時使用走路動畫
      currentFrameWidth = walkFrameWidth;
      currentFrame = 0; // 確保靜止時顯示第一個畫格
      currentFrameImage = walkFrames[0];
    }

    // 限制角色在畫布範圍內移動
    characterX = constrain(characterX, currentFrameWidth / 2, width - currentFrameWidth / 2);

    // --- 繪製角色 ---
    push(); // 儲存當前的繪圖狀態
    translate(characterX, characterY); // 將原點移動到角色的位置
    if (characterDirection === -1) { // 如果角色方向向左，則水平翻轉
      scale(-1, 1);
    }
    // 由於使用了 imageMode(CENTER) 和 translate，圖片會以 (0,0) 為中心繪製
    image(currentFrameImage, 0, 0);
    pop(); // 恢復之前的繪圖狀態

    // --- 繪製角色二 ---
    let char2Anim, char2FrameCount;
    if (character2State === 'b') {
      char2Anim = bFrames;
      char2FrameCount = bFrameCount;
    } else if (character2State === 'c') {
      char2Anim = cFrames;
      char2FrameCount = cFrameCount;
    } else { // 'a'
      char2Anim = aFrames;
      char2FrameCount = aFrameCount;
    }

    let char2CurrentFrameIndex = floor(frameCount / 6) % char2FrameCount;
    let char2CurrentFrameImage = char2Anim[char2CurrentFrameIndex];
    push();
    translate(aX, aY);
    scale(aScale); // 將角色二放大
    image(char2CurrentFrameImage, 0, 0); // 繪製放大後的圖片
    pop();

    // --- 繪製角色三 ---
    let char3Anim, char3AnimFrameCount;
    if (character3State === 'b') {
      char3Anim = char3bFrames;
      char3AnimFrameCount = char3bFrameCount;
    } else if (character3State === 'c') {
      char3Anim = char3cFrames;
      char3AnimFrameCount = char3cFrameCount;
    } else { // 'a'
      char3Anim = char3aFrames;
      char3AnimFrameCount = char3FrameCount;
    }
    let char3CurrentFrameIndex = floor(frameCount / 8) % char3AnimFrameCount;
    let char3CurrentFrameImage = char3Anim[char3CurrentFrameIndex];
    push();
    translate(char3X, char3Y);
    scale(char3Scale);
    image(char3CurrentFrameImage, 0, 0);
    pop();


    // --- 繪製對話框 ---
    if (character2Dialogue && gameState !== 'IDLE') {
      let dialogueX = (gameState === 'QUESTION_F1' || gameState === 'CORRECT' || gameState === 'INCORRECT') ? char3X : aX;
      let dialogueY = (gameState === 'QUESTION_F1' || gameState === 'CORRECT' || gameState === 'INCORRECT') ? char3Y - (char3SheetHeight * char3Scale) / 2 - 10 : aY - (aSheetHeight * aScale) / 2 - 10;

      fill(0);
      noStroke();
      textSize(20);
      textAlign(CENTER, BOTTOM);
      text(character2Dialogue, dialogueX, dialogueY);
    }

    // --- 碰撞偵測與遊戲邏輯 ---
    if (gameState === 'IDLE') {
      // 偵測角色一和角色二(數學題)是否碰撞
      let d2 = dist(characterX, characterY, aX, aY);
      if (d2 < (runFrameWidth / 4 + aFrameWidth * aScale / 2)) {
        triggerQuestion('MATH');
      }
      // 偵測角色一和角色三(F1題)是否碰撞
      let d3 = dist(characterX, characterY, char3X, char3Y);
      if (d3 < (runFrameWidth / 4 + char3FrameWidth * char3Scale / 2)) {
        triggerQuestion('F1');
      }
    }

    // --- 更新動畫畫格 ---
    // 如果角色不是靜止狀態，才更新畫格
    if (characterState !== 'idle') {
      if (frameCount % animationSpeed === 0) {
        currentFrame = (currentFrame + 1) % currentAnimationFrames.length;
      }
    }
  }
}

function triggerQuestion(type) {
  let targetX, targetY;

  if (type === 'MATH') {
    gameState = 'QUESTION_MATH';
    let questionIndex = floor(random(mathQuestionsTable.getRowCount()));
    currentQuestion = mathQuestionsTable.getRow(questionIndex);
    targetX = aX;
    targetY = aY;
  } else if (type === 'F1') {
    gameState = 'QUESTION_F1';
    let questionIndex = floor(random(f1QuestionsTable.getRowCount()));
    currentQuestion = f1QuestionsTable.getRow(questionIndex);
    targetX = char3X;
    targetY = char3Y;
  }

  if (currentQuestion) {
    // 設定要顯示的題目文字
    character2Dialogue = currentQuestion.getString('題目');

    // 建立輸入框和按鈕
    answerInput = createInput();
    answerInput.position(targetX - 75, targetY + 50);
    answerInput.size(150);

    submitButton = createButton('回答');
    submitButton.position(answerInput.x + answerInput.width, targetY + 50);
    submitButton.mousePressed(checkAnswer);
  }
}

function checkAnswer() {
  let userAnswer = answerInput.value();
  let correctAnswer = currentQuestion.getString('答案');

  if (gameState === 'QUESTION_MATH') {
    if (userAnswer === correctAnswer) {
      // 答對數學題
      gameState = 'CORRECT';
      character2Dialogue = currentQuestion.getString('答對回饋');
      character2State = 'b'; // 角色二切換為開心動畫
    } else {
      // 答錯數學題
      gameState = 'INCORRECT';
      character2Dialogue = currentQuestion.getString('答錯回饋');
      character2State = 'c'; // 角色二切換為難過動畫
    }
  } else if (gameState === 'QUESTION_F1') {
    if (userAnswer === correctAnswer) {
      // 答對F1題
      gameState = 'CORRECT';
      character2Dialogue = currentQuestion.getString('答對回饋');
      character3State = 'b'; // 角色三切換為開心動畫
    } else {
      // 答錯F1題
      gameState = 'INCORRECT';
      character2Dialogue = currentQuestion.getString('答錯回饋');
      character3State = 'c'; // 角色三切換為難過動畫
    }
  }

  // 移除輸入框和按鈕
  answerInput.remove();
  submitButton.remove();

  // 幾秒後重置狀態
  setTimeout(resetGame, 3000); // 3秒後重置
}

function resetGame() {
  gameState = 'IDLE';
  character2Dialogue = '';
  character2State = 'a'; // 恢復為 a.png 動畫
  character3State = 'a'; // 恢復為 a.png 動畫
}
// ... (windowResized 和 mousePressed 函式)

// 當視窗大小改變時，重新調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被按下時會觸發此函式
function mousePressed() {
  // 確保畫格已載入，且按下的是滑鼠左鍵
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded && aFramesLoaded && bFramesLoaded && cFramesLoaded && char3aFramesLoaded && char3bFramesLoaded && char3cFramesLoaded && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (mouseButton === LEFT) {
      // 按下左鍵，向左跑
      characterState = 'running';
      characterDirection = -1;
      currentFrame = 0;
    } else if (mouseButton === RIGHT) {
      // 按下右鍵，向右跑
      characterState = 'running';
      characterDirection = 1;
      currentFrame = 0;
    }
  }
}

// 當鍵盤被按下時會觸發此函式
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    // 如果按下左方向鍵，設定為走路狀態，方向向左
    characterState = 'walking';
    characterDirection = -1;
    currentFrame = 0;
  } else if (keyCode === RIGHT_ARROW) {
    // 如果按下右方向鍵，設定為走路狀態，方向向右
    characterState = 'walking';
    characterDirection = 1;
    currentFrame = 0;
  } else if (keyCode === UP_ARROW) {
    // 如果按下上方向鍵，設定為跳躍狀態
    characterState = 'jumping';
    currentFrame = 0;
  } else if (keyCode === DOWN_ARROW) {
    // 如果按下下方向鍵，停止跳躍，回到靜止狀態
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 當鍵盤按鍵被放開時會觸發此函式
function keyReleased() {
  // 只有當放開的是左右方向鍵，並且角色當前是走路狀態時，才切換回靜止狀態
  if ((keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) && characterState === 'walking') {
    characterState = 'idle';
    currentFrame = 0; // 靜止時顯示走路動畫的第一個畫格
  }
}

// 當滑鼠按鍵被放開時會觸發此函式
function mouseReleased() {
  // 如果角色當前是跑步狀態，則切換回靜止狀態
  if (characterState === 'running') {
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 防止在畫布上點擊右鍵時彈出選單
document.oncontextmenu = function() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    return false;
}
