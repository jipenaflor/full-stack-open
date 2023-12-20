const BlogForm = ({ title, author, url, handleTitle, handleAuthor, handleUrl, handleAddBlog }) => {
    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={ handleAddBlog }>
                <div>
                    title: <input value={ title } onChange={ handleTitle }/>
                </div>
                <div>
                    author: <input value={ author } onChange={ handleAuthor }/>
                </div>
                <div>
                    url: <input value={ url } onChange={ handleUrl }/>
                </div>
                <div>
                    <button type='submit'>create</button>
                </div>
            </form>
        </div>
    )
}

export default BlogForm