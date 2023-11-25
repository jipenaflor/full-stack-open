const Header = ({course}) => {
    return (
        <h3>{course}</h3>
    )
}

const Part = ({part}) => {
    return (
        <div>
            <p>{part.name} {part.exercises}</p>
        </div>
    )
}

const Content = ({parts}) => {
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part}/>)}
        </div>
    )
}

const Total = ({parts}) => {
    const total = parts.reduce((sum, parts) => sum + parts.exercises, 0)
    return (
        <div>
            <p><b>total of {total} exercises</b></p>
        </div>
    )
}

export const Course = ({course}) => {
    return (
        <div>
            <Header key={course.id} course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
}

export default Course