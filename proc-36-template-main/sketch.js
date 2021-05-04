var dog, dogImg, happyDog, happyDogImg;
var feedPetButton, addFoodButton;
var foodObj, foodStock;
var food;
var feedTime;
var database;
var milk, milkImg;
var fedTime, lastFed;
var input, button;
var nameref;
var petName;

function preload() {
  dogImg = loadImage("Dog.png"); 
  happyDogImg = loadImage("happy dog.png");
  milkImg = loadImage("Milk.png")
}

function setup(){
  createCanvas(1200,550)

  database = firebase.database();

  foodsRef = database.ref("Food");
  foodsRef.on("value",function(data){
    foodStock = data.val();
  });

  nameref=database.ref("petName");
  nameref.on("value",function(data){
    petName = data.val();
  })

  dog = createSprite(1100,430,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  milk = createSprite(1010,465,10,10);
  milk.addImage(milkImg);
  milk.scale = 0.07;

  addFoodButton = createButton("ADD FOOD");
  addFoodButton.position(1000,20);
  addFoodButton.mousePressed(addFoods);

  feedPetButton = createButton("FEED DOG");
  feedPetButton.position(1100,20);
  feedPetButton.mousePressed(feedDog);

  foodObj = new Food();

  fedTime = database.ref('feedTime')
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  
  input=createInput("Name your pet 🐶");
  input.position(560,20);
  
  
  button=createButton("Done 👍🏻");
  button.position(750,20);
  button.mousePressed(namingDog)

}

function draw(){
  background("black")

  foodObj.display();
  foodObj.getFoodStock();

  stroke("black")
  fill("white")
  textSize(20)
  textFont("Dancing Script")
  if(lastFed >= 12){
    text("Last Fed : " + lastFed % 12 + " PM", 10,20)
  } else if(lastFed == 0){
    text("Last Fed : 12 AM",10,20)
  } else{
    text("Last Fed : " + lastFed + " AM",10,20)
  }

  stroke("black")
  fill("white")
  textSize(25)
  textFont("Dancing Script")
  text("Let's feed " + petName,450,30)

  drawSprites();

}

function addFoods() {
  dog.addImage(dogImg);
  foodStock++;
  database.ref("/").update({
    food: foodStock
  });
}

function feedDog() {
  dog.addImage(happyDogImg);

  foodObj.deductFood(foodStock);
  database.ref("/").update({
    food: foodStock,
    feedTime: hour()
  })
}

function namingDog(){
  petName = input.value();
  button.hide();
  input.hide();
  database.ref("/").update({
    petName:petName
  })
}