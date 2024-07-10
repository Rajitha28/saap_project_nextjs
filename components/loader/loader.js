import '../../styles/css/loader.css'
const Loader = () => {
    return (
        <>
        <div className='loaderDiv'>
        <div className="loader book">
            <figure className="page"></figure>
            <figure className="page"></figure>
            <figure className="page"></figure>
        </div><h1 className='loading-text'>Loading</h1>
        </div>
        </>
    )
}

export default Loader;