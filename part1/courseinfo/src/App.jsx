const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
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
  console.log(props)
  return (
    <div>
      <Part part={props.course.parts[0].part} exercise={props.course.parts[0].exercises}/>
      <Part part={props.course.parts[1].part} exercise={props.course.parts[1].exercises}/>
      <Part part={props.course.parts[2].part} exercise={props.course.parts[2].exercises}/>
    </div>
  )
} 

const Total = (props) => {
  return (
    <div>
      <p>Number of Exercises {props.course.parts[0].exercises + 
        props.course.parts[1].exercises + props.course.parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack Application Development',
    parts:  [
      {part: 'Fundamentals of React', exercises: 10},
      {part: 'Using props to pass data', exercises: 7},
      {part: 'State of a component', exercises: 14},
    ]
  }
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App