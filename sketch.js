var backgroundimg,ground;
var points;
var invinsible;
var boy,boyRunning,boyCollide,boyJump,boyattack;
var cloudimg,cloudgroup;
var coinimg, coingroup;
var start,restart,gameover,startimg,restartimg,gameoverimg;
var bulletimg,bulletgroup;
var obstaclegroup;
var gameState = "START";
var knightimg;
var ground,groundimg;
var score;
var obstacle,bullet,coin
var instructionimg,instruction;
var knightsound,gunsound,coinsound,clicksound,jumpsound,collidesound,gameoversound; 
var birdimg,bird,birdgroup
function preload() {
    backgroundimg=loadImage("background 1.jpg");
    boyRunning = loadAnimation("boy 1.png","boy 2.png");
    boyCollide = loadAnimation("boy 5(collide).png","boy 6(collide).png");
    boystay = loadAnimation("boy 1.png")
    boyJump = loadAnimation("boy 3 (jump).png","boy 4 (jump).png");
    cloudimg = loadImage("cloud.png");
    coinimg = loadImage("coin 2.png");
    startimg = loadImage("start.png");
    restartimg = loadImage("restart.png");
    gameoverimg =loadImage("game over.png");
    boyattack = loadAnimation("boy 7 (attack).png");
    bulletimg = loadImage("bullet.png");
    knightimg = loadImage("knight.png");
    groundimg = loadImage("ground.png");
    instructionimg = loadImage("INSTRUCTIONS.png");
    birdimg =loadImage("bird.png")
    coinsound = loadSound("success-1-6297.mp3")
      gunsound = loadSound("shotgun-firing-4-6746.mp3")  
      clicksound =  loadSound("success_bell-6776.mp3") 
      jumpsound=loadSound("cartoon-jump-6462.mp3")  
      collidesound = loadSound("cartoon-scream-1-6835.mp3")
      backgroundsound = loadSound("gates-of-heaven-music-6705.mp3")
      gameoversound = loadSound("game-over-arcade-6435.mp3")
}
function setup(){
    createCanvas(windowWidth,windowHeight);
    // ground
    ground = createSprite(width/2,600,900,2);
    ground.addImage(groundimg)
    ground.x = ground.width /2;
    ground.scale = 3
    
  // instruction
  instruction=createSprite(250,300,50,50)  
  instruction.addImage("instruction",instructionimg)

//invinsible wall
invinsible = createSprite(windowWidth - 685,windowHeight - 70,windowWidth,100);
invinsible.visible = false;
// boy
boy=createSprite(200,500,25,55)
boy.addAnimation("running",boyRunning);
boy.addAnimation("collide",boyCollide);
boy.addAnimation("jump",boyJump);
boy.addAnimation("attack",boyattack);
boy.addAnimation("stay",boystay)

//start
start = createSprite(windowWidth/2,windowHeight/2)
start.addImage(startimg)
start.visible=false
//restart
restart = createSprite(windowWidth/2,500)
restart.addImage(restartimg)
restart.scale = 0.3
restart.visible = false
// game over
gameover = createSprite(windowWidth/2,windowHeight/2)
gameover.addImage(gameoverimg)
gameover.visible = false

//create group
coingroup = createGroup()
bulletgroup = createGroup()
obstaclegroup = createGroup()
cloudgroup = createGroup()
birdgroup = createGroup()
// score
score = 0
points = 0
}
function draw() {
    background(backgroundimg); 
    // writing
 stroke("black");
fill("black");
textSize(30);
text("points:"+points, windowWidth - 200,90)
stroke("black");
fill("black");
textSize(30);
text("score:"+score, windowWidth - 200,120)
// depth
instruction.depth = boy.depth;
 instruction.depth = instruction.depth + 1;
 

// gamestates
if(gameState === "START"){
    boy.changeAnimation("running",boyRunning)
    gameover.visible = false;
    restart.visible = false;
 start.visible = true
 ground.velocityX = 0;
 if(mousePressedOver(start)){
     clicksound.play()
 gameState = "PLAY"
 }
}

if(gameState === "PLAY"){
    boy.changeAnimation("running",boyRunning)
    instruction.visible = false;
    start.visible = false;
    gameover.visible = false;
    restart.visible = false;
     // infinite ground
 if (ground.x < 0){
    ground.x = ground.width/2;
  }
  ground.velocityX = -(4 + 3* score/100)
  // score
  score = score + Math.round(getFrameRate()/60);
   //condition
if(coingroup.isTouching(boy)){
    coin.destroy()
    coinsound.play()
    points = points+20
}
if(obstaclegroup.isTouching (boy)){
  boy.changeAnimation("collide",boyCollide)
  gameoversound.play()
  collidesound.play()  
gameState = "END"
}
if(bulletgroup.isTouching(obstaclegroup)){
    bulletgroup.destroyEach()
    obstaclegroup.destroyEach()
    points=points+100
}
if(birdgroup.isTouching(boy)){
boy.changeAnimation("collide",boyCollide)
gameoversound.play()
collidesound.play()
gameState = "END"
}

if(boy.x >= windowWidth || boy.x<= 0){
    gameState = "END"
}
 //controls
  if(keyDown("up") && boy.y >= 200){
    boy.changeAnimation("jump",boyJump)
    jumpsound.play()
    boy.velocityY= -8.5;
}
boy.velocityY = boy.velocityY +1.5;

if(keyDown("right")){
    boy.x=boy.x+2 
}

if(keyDown("left")){
    boy.x=boy.x-2
}
// attack
if(keyDown("space")){
    gunsound.play()
    createbullet()
} ;
if(World.frameCount%90 === 5){
        obstacles();      
    }
if(World.frameCount%300 === 5){
    createclouds()
}
if(World.frameCount%150 === 0){
    coins();
}
if (World.frameCount%200 === 0){
    birds()
}
}


if(gameState === "END"){
    
    gameover.visible = true;
        restart.visible = true;
        ground.velocityX = 0;
        obstaclegroup.setVelocityXEach(0)
        coingroup.setVelocityXEach(0)
        cloudgroup.setVelocityXEach(0)
    if(mousePressedOver(restart)){
        clicksound.play()
        reset()
    }
}


// collision
boy.collide(invinsible)
boy.setCollider("rectangle",0,0,100,150)
boy.debug = false;

drawSprites();
}
//birds
function birds() {
    bird = createSprite(500,Math.round(random(300,100)),50,20)
    bird.velocityX = -(6 + score/100)
    birdgroup.add(bird)
    bird.addImage(birdimg)
    birdgroup.setLifetimeEach(-1)
    
}

// coin
function coins(){
    coin = createSprite(Math.round(random(400,500)),Math.round(random(450,550)),20,20)
     coin.addImage(coinimg)
     coin.scale = 0.3
     coingroup.add(coin)
    coin.setCollider("rectangle",0,0,200,200)
    coin.velocityX = -3
    coingroup.setLifetimeEach(-1)
    }
    
    // bullet
    function createbullet(){
        bullet = createSprite(300,460,20,20)
        bullet.addImage(bulletimg)
        bullet.x=boy.x + 85
        bullet.velocityX = +2
        bullet.scale = 0.5
        bulletgroup.add(bullet)
        boy.changeAnimation("attack",boyattack)
    
    }
    
    //reset
    function reset(){
        score = 0
        points = 0
        gameState = "PLAY"
        gameover.visible = false
        restart.visible = false
        obstaclegroup.destroyEach()
        coingroup.destroyEach()
        cloudgroup.destroyEach()
        boy.changeAnimation("running",boyRunning)
        boy.x = 200;
    }
    
    //cloud
  function createclouds(){
 //cloud
  cloud=createSprite(500,Math.round(random(300,100)),50,20)
cloud.velocityX = -1
 //load image
  cloud.addImage(cloudimg)
   cloudgroup.setLifetimeEach(-1)
cloudgroup.add(cloud)
cloud.depth = boy.depth
boy.depth = boy.depth + 1
            } 

    
    // obstacles
    function obstacles(){
  obstacle = createSprite(Math.round(random(1500,1100)),456,10,40);
 obstacle.velocityX = -(6 + score/100)
 obstacle.addImage(knightimg);
 obstacle.scale=0.5
  obstaclegroup.setLifetimeEach(-1)
   obstaclegroup.add(obstacle)
    }


      
