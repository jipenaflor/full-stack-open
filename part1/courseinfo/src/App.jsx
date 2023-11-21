const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.exercise}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0].part} exercise={props.parts[0].exercises}/>
      <Part part={props.parts[1].part} exercise={props.parts[1].exercises}/>
      <Part part={props.parts[2].part} exercise={props.parts[2].exercises}/>
    </div>
  )
} 

const Total = (props) => {
  return (
    <div>
      <p>Number of Exercises {props.exercises[0].exercises + props.exercises[1].exercises + props.exercises[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack Application Development'
  const parts = [
    {part: 'Fundamentals of React', exercises: 10},
    {part: 'Using props to pass data', exercises: 7},
    {part: 'State of a component', exercises: 14},
  ]
  return (
    <div>
      <Header course={course}/>
      <Content parts={parts}/>
      <Total exercises={parts}/>
    </div>
  )
}

export default App