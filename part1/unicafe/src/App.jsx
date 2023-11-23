import { useState } from "react"

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({text, score}) => {
  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td>
        <td>{score} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{score}</td>
    </tr>
  )
}

const Statistics = ({data}) => {
  if (data.good === 0 && data.neutral === 0 && data.bad === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  const all = data.good + data.neutral + data.bad
  const ave = (data.good - data.bad) / all
  const pos = (data.good / all) * 100
  return (
    <table>
      <tbody>
        <StatisticLine text='good' score={data.good}/>
        <StatisticLine text='neutral' score={data.neutral}/>
        <StatisticLine text='bad' score={data.bad}/>
        <StatisticLine text='all' score={all}/>
        <StatisticLine text='average' score={ave}/>
        <StatisticLine text='positive' score={pos}/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [clicks, setClicks] = useState({good: 0, neutral: 0, bad: 0})

  const increaseGood = () => setClicks({... clicks, good: clicks.good + 1})
  const increaseNeutral = () => setClicks({... clicks, neutral: clicks.neutral + 1})
  const increaseBad = () => setClicks({... clicks, bad: clicks.bad + 1})

  return (
    <div>
      <Header text='give feedback'/>
      <Button onClick={increaseGood} text='good'/>
      <Button onClick={increaseNeutral} text='neutral'/>
      <Button onClick={increaseBad} text='bad'/>

      <Header text='statistics'/>
      <Statistics data={clicks}/>
    </div>
  )
}

export default App