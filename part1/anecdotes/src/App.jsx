import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Display = ({votes}) => {
  return (
    <div>
      has {votes} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const randomSelect = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const increasePoints = () => {
    const copy = [... points]
    copy[selected] += 1
    setPoints(copy)
  }

  const maxPoints = Math.max(...points)
  const maxAnecdote = points.indexOf(maxPoints)
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <Display votes={points[selected]}/>
      <div>
        <Button onClick={increasePoints} text='vote'/>
        <Button onClick={randomSelect} text='next anecdote'/>
      </div>

      <h1>Anecdote with most votes</h1>
      {anecdotes[maxAnecdote]}
      <Display votes={maxPoints}/>
    </div>
  )
}

export default App