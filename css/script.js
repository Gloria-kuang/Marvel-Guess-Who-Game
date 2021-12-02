let score = 0;
let answered = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const API_KEY = "83f3b039b66be5a43b79b16e889f8272"
const HASH = "711405c3050697f6da9df18482b0dcc5"

const cards =["card--1", "card--2", "card--3"]
let loadQuestion =(()=> {
    let promises = cards.map((card) => {
        let number = getRandomInt(0, 1539)
        let API_URL = `http://gateway.marvel.com/v1/public/characters?ts=1&apikey=${API_KEY}&hash=${HASH}&offset=${number}`
        return axios.get(API_URL).then(response => {
            let charArray = response.data.data.results;
            let filtered = []
            charArray.forEach(char => {
                if (!(char.thumbnail.path).includes("image_not_available")) {
                    filtered.push(char)
                }
            });
            let extension = filtered[0].thumbnail.extension
            let imageURL = filtered[0].thumbnail.path+"/portrait_uncanny."+extension;
            return {name: filtered[0].name, id: card, image: imageURL}
        })
    
    })
    
    Promise.all(promises).then( heroes => {
        heroes.forEach(hero => {
            let imageEl = document.getElementById(hero.id);
            imageEl.setAttribute("src", hero.image)
        })
    
        generateQuestion(heroes)
    })

})

loadQuestion()

function generateQuestion(heroes) {
    const questionEL = document.getElementById ('question')
    const index = getRandomInt(0,3)
    questionEL.setAttribute("accessKey", index)
    questionEL.innerText = 'Which of the following is ' + heroes[index].name + '?'
}


function eventHandler(selectedIndex){
    const questionEL = document.getElementById ('question')
    rightIndex = Number(questionEL.accessKey)
    const selectedCard = document.getElementById(`card${selectedIndex+1}`);
    const rightCard = document.getElementById(`card${rightIndex+1}`);

    const scoreEl = document.getElementById('score');
    const answeredEl = document.getElementById('answered')
    answeredEl.innerText = answered +=1;

    const barProgress = document.querySelector('.bar__progress')
    barProgress.style.width = 20*answered.toString() +'%';


    if (rightIndex===selectedIndex){
        selectedCard.style.backgroundColor= "green";
        scoreEl.innerText = score+=1;
    } else {
        selectedCard.style.backgroundColor= "red"
        rightCard.style.backgroundColor= "green"        
        
    }
    setTimeout(()=>{
        selectedCard.style.backgroundColor= "white";
        rightCard.style.backgroundColor= "white" ;

        if (answered < 5) {
            loadQuestion()
        } else {
            const popUp = document.querySelector('.pop-up');
            popUp.classList.add('pop-up--display');

            const popUpText = document.querySelector('.pop-up__text')
            popUpText.innerText = 'Your score is ' + score + '/5'

            const cardContainer = document.querySelector('.card-container');
            cardContainer.classList.add('card-container--hidden');

            const questionContainer = document.querySelector('.question');
            questionContainer.classList.add('question--hidden');

        }

}, 
        2000)
}

function addListener () {
    const cardEl = document.querySelectorAll('.card');
    cardEl.forEach ( (item, selectedIndex) => {
        item.addEventListener ('click', () => {
            eventHandler(selectedIndex)
        })
    })
    
}
    
addListener()
