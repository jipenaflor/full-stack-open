const LoginForm = ({ username, password, handleUsername, handlePassword, handleLogin }) => {
    return (
        <div>
            <form onSubmit={ handleLogin }>
                <div>
                    username <input value={ username } onChange={ handleUsername }/>
                </div>
                <div>
                    password <input value={ password } onChange={ handlePassword } />
                </div>
                <div>
                    <button type='submit'>login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm