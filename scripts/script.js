const dinosaurs = [
  {
    name: "allosaurus",
    url: "./assets/allosaurus.jpg",
  },
  {
    name: "allosaurus",
    url: "./assets/allosaurus.jpg",
  },
  {
    name: "baryonyx",
    url: "./assets/baryonyx.jpg",
  },
  {
    name: "baryonyx",
    url: "./assets/baryonyx.jpg",
  },
//   {
//     name: "deinonychus",
//     url: "./assets/deinonychus.jpg",
//   },
//   {
//     name: "deinonychus",
//     url: "./assets/deinonychus.jpg",
//   },
//   {
//     name: "stegosaurus",
//     url: "./assets/stegosaurus.jpg",
//   },
//   {
//     name: "stegosaurus",
//     url: "./assets/stegosaurus.jpg",
//   },
//   {
//     name: "velociraptor",
//     url: "./assets/velociraptor.jpg",
//   },
//   {
//     name: "velociraptor",
//     url: "./assets/velociraptor.jpg",
//   },
//   {
//     name: "triceratops",
//     url: "./assets/triceratops.jpg",
//   },
//   {
//     name: "triceratops",
//     url: "./assets/triceratops.jpg",
//   },
//   {
//     name: "lambeosaurus",
//     url: "./assets/lambeosaurus.jpg",
//   },
//   {
//     name: "lambeosaurus",
//     url: "./assets/lambeosaurus.jpg",
//   },
//   {
//     name: "trex",
//     url: "./assets/trex.jpg",
//   },
//   {
//     name: "trex",
//     url: "./assets/trex.jpg",
//   },
];

const myApp = {};

myApp.moves = 0;
myApp.firstMove = null;
myApp.secondMove = null;
myApp.resultArray = [];
myApp.flippedCardOne = null;
myApp.flippedCardTwo = null;
myApp.resultArray = [];
myApp.opened = [];
myApp.moves = 0;
myApp.timer;
myApp.seconds = 0;

//This function loads the cards on page load
myApp.displayCard = () => {
  myApp.shuffle(dinosaurs);

  dinosaurs.forEach((dinos, index) => {
    console.log(dinos, index);
    let cardsHtml = `
            <div class="card">
                    <div class="cardFace cardBack" data-id="${index}">
                        <img  src="${dinos.url}" alt="${dinos.name}" >
                    </div>
                    <div class="cardFace cardFront visible">
                        <img  src="./assets/claws.png" alt="claws">
                    </div>
                </div>`;

    $(".grid").append(cardsHtml);
  });
};

//Thanks to Esther for sharing the Fisher-Yates Shuffle Method
//This function shuffles the cards to create a different card arrangement everytime the user starts the game
myApp.shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

myApp.isGameOver = () => {};

myApp.storeCard = (selectedCardContainer) => {
    console.log($(selectedCardContainer).children().eq(1).attr("class"));
  let cardSide = $(selectedCardContainer).children().eq(1).attr("class");

  //check if the user is clicking on the same card

  if (cardSide !== "cardFace cardBack") {
    console.log('here')
    
    $(selectedCardContainer).toggleClass('visible');
    // $(selectedCardContainer).children().eq(1).toggleClass('visible');

    const openedCard = {};
    //QUESTION - should this be in a variable -> $(this).children().attr("data-id")

    openedCard.name =
      dinosaurs[$(selectedCardContainer).children().eq(0).attr("data-id")].name;
    openedCard.id = $(selectedCardContainer).children().eq(0).attr("data-id");
    myApp.opened.push({ name: openedCard.name, id: openedCard.id });
    myApp.moves++;
    myApp.updateMoves();
    myApp.compareCards();
  }

};

myApp.compareCards = () => {
  //   console.log(selectedCardContainer);

  //check if the number of opened cards is greater than one

  if (myApp.opened.length === 2) {
    if (myApp.opened[0].name === myApp.opened[1].name) {
      //add them to the result array and clear opened array
      myApp.opened.forEach((matchedDinos) => {
        myApp.resultArray.push(matchedDinos);
      });

      myApp.updateSuccessfulMoves();
      if (myApp.resultArray.length === dinosaurs.length) {
        let totalTime = myApp.getTotalTime();
        let rating = myApp.getRatings();
        console.log(`total time ${totalTime} and rating is ${rating}`)
        $('.totalTime').html(totalTime);
         $(".ratingStar").html("");
        for(i = 1; i<= rating; i++){
            $(".ratingStar").append('⭐️');
        }
        $('#gameAudio2')[0].play();
        // document.getElementById("gameAudio").play();
        $("#gameOver").addClass("visible");
        clearInterval(myApp.timer);
        totalTime =0;
      }
      else {
        $('#gameAudio1')[0].play();
    }
      myApp.opened = [];
      

    } 
    else {
      //close/turn the cards back again with a timeout function

      setTimeout(() => {
        myApp.opened.forEach((card) => {
          console.log($(`[data-id="${card.id}"]`));
          $(`[data-id="${card.id}"]`).parent().toggleClass("visible");
        //   console.log($(`[data-id="${card.id}"]`).siblings());
        //   $(`[data-id="${card.id}"]`).siblings().addClass("visible");
        });
        myApp.opened = [];
      }, 1200);
    }
  }
};

myApp.updateSuccessfulMoves = () => {
  $("#success-count").html(myApp.resultArray.length);
};

myApp.updateMoves = () => {
  $("#moves-count").html(myApp.moves);
};

myApp.startTimer = function () {
  //   let seconds = 0;

  function pad(val) {
    return val > 9 ? val : "0" + val;
  }
  myApp.timer = setInterval(() => {
    $("#seconds").html(pad(++myApp.seconds % 60));
    $("#minutes").html(pad(parseInt(myApp.seconds / 60, 10)));
  }, 1000);
};

myApp.getTotalTime = () => {
  console.log(`seconds`, myApp.seconds);
  let minutes = parseInt(myApp.seconds / 60, 10);
  let second = myApp.seconds % 60;
  console.log(`${minutes}:${second}`);
  return `${minutes}.${second}`;
};

myApp.getRatings = () => {
    let ratings = 0;
    if (myApp.moves === dinosaurs.length)
    {
        return (ratings = 5);
    }else if (myApp.moves === dinosaurs.length + (dinosaurs.length * 0.25)) {
        return (ratings = 4);
    }else if (myApp.moves === dinosaurs.length + (dinosaurs.length * 0.50)) {
        return (ratings = 3);
    }
    else return (ratings = 2);


}
myApp.gameRestart = () => {
  $(".grid").empty();
  $("#seconds").html("00");
  $("#minutes").html("00");
  $("#success-count").html(0);
  $("#moves-count").html(0);

  myApp.resultArray = [];
  myApp.opened = [];
  myApp.moves = 0;
  console.log(`clear all 1${myApp.resultArray.length}`);
  console.log(`clear all  2${myApp.opened.length}`);
  console.log(`clear all 3${myApp.moves}`);

  console.log(`timer`, myApp.timer);
  myApp.displayCard();
};

myApp.cardClickEventListener = function () {
  $(".goAgain").on("click", function () {
    $("#gameOver").removeClass("visible");
    myApp.gameRestart();
  });

  $(".grid").on("click", ".card", function () {
      console.log(this)
    // change this to on click of start
    if (myApp.moves === 0) {
      myApp.startTimer();
    }
    myApp.storeCard(this);
  });
};

myApp.init = () => {
  myApp.cardClickEventListener();
};

$(function () {
  myApp.init();
});
