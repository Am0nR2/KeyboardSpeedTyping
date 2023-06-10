import React, {useRef ,useState, useEffect } from 'react'
import {wordsData} from "./assets/WordData"
import {shuffle} from "./assets/utils"
function App() {

// State Declorations

  const [randomWords, setRandomWords] = useState([])
  const [userInput, setUserInput] = useState("")
  const [falseInputs, setFalseInputs] = useState([])
  const [userInputs, setUserInputs] = useState([])
  const [trueInputs, setTrueInputs] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [testStarted, setTestStarted] = useState(false)
  const [disabled, setDisabled] = useState(false)

 // useRef
  const myRef = useRef(null)

// useEffect Decloration


  useEffect(()=>{
    setRandomWords(wordsData)
  },[testStarted])
  
  useEffect(()=>{
    if((timeRemaining !==0) && testStarted){
      setTimeout(()=>
      setTimeRemaining(prevTime => prevTime -1), 1000)
      
    } else if(timeRemaining === 0){
      endGame()
    }
  },[timeRemaining, testStarted])




  const randomWordsHTML = randomWords.map(word=>{
    const className = !testStarted ? "" : trueInputs.includes(word) ? 
    "true" : falseInputs.includes(word) ? "false"
    : "" 
    return (
    <div className='label' key={word}>
      <input 
        type="radio" 
        value={word}
        name='word'
        id={word}
        ref={randomWords[0] === word ? myRef : null}
        checked={!testStarted ? false : randomWords[(userInputs.length)] === word ? true : false}
    />
    <label className={className} id={`${word}one`} htmlFor={word}>{word}</label>
    </div>
  )})

  if(userInputs.length > 0 && userInputs.length % 6 === 0){
    document.getElementById("wordsArea").scrollTo(0, (userInputs.length*5.5))
    // önceden 4.6 burada, 6 tane css kısmındaydı

  }
 
  
  // Functions
  const getWord = (e) => {
    if(!testStarted){
      startGame()
    }
      setUserInput((e.target.value).trim())
  }
    
  const getWords = (e) => {
    if (e.key == " " ||
    e.code == "Space" ||      
    e.keyCode == 32      
    ) {
      
    setUserInputs(prevState => [...prevState, userInput])
    if(randomWords[userInputs.length] !== userInput){
      setFalseInputs(prevState=> [...prevState, randomWords[userInputs.length]])
    } else{
      setTrueInputs(prevState=> [...prevState, randomWords[userInputs.length]])
    }
    setUserInput("")
  }   
}
  const startGame = ()=> {
    setFalseInputs([])
    setUserInputs([])
    setTrueInputs([])
    setTestStarted(true)
  } 
  const endGame = () =>{
    setDisabled(true)
    setUserInput("Test is over")
    setTimeout(()=>{
      setUserInput("")
      setDisabled(false)
    }, 3000)
    setTestStarted(false) 
    setTimeRemaining(60)
    setRandomWords(shuffle(wordsData))
    document.getElementById("wordsArea").scrollTo(0, 0)
    myRef.current.focus();
   

  }
  console.log(myRef)
  return (
    <div>
      <h1 className='title'>Am0nR2's Word Counter</h1>
      <h2 className='info'>Just type to start test...</h2>
      <div id="wordsArea" className='wordsArea' >
        {randomWordsHTML}
      </div>
      <div className='inputArea'>
        <h3>{timeRemaining} </h3>
        <input disabled={disabled} onChange={getWord} onKeyUp={getWords} type="text" name="userWords" id="userWords" value={userInput} />
      </div>
      <div style={{display: testStarted ? "none" : "flex"}} className='resultArea'>
        <h3>Total Words : <span className='total'>{userInputs.length}</span></h3>
        <h3>Correct Words : <span className='true'>{trueInputs.length}</span></h3>
        <h3>Incorrect Words : <span className='false'>{falseInputs.length}</span></h3>

      </div>

    </div>
  )
}

export default App
