import React, {useState, useEffect} from 'react'
import { Loader, Card, FormField} from '../components'

const RenderCards = ({ data, title }) => {
    if(data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />)
    }

    return (
        <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
            {title}
        </h2>
    )

}
const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState(null);

    const[searchText, setSearchText] = useState('');

    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setsearchTimeout] = useState(null)

    
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/post',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                setAllPosts(result.data.reverse());
                console.log(result.data)
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };
    console.log('Fetching posts...')
    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearchChange = async (e) => {
        clearTimeout(searchTimeout);

        setSearchText(e.target.value);

        setsearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) 
                || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

                setSearchedResults(searchResults)
            }, 500)
        );
    }

    return (
        <section className='max-w-7x1 mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>
                    The Community Showcase
                </h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>
                    Discover and create mesmerizing AI-generated pixel art with PixelWiz. Explore a captivating collection of visually stunning images brought to life by DALL-E API.
                </p>
            </div>
            <div className='mt-16'>
                <FormField
                    LabeLName="Search Posts"
                    type="text"
                    name="text"
                    placeholder="Search Posts"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>
            <div className='mt-10'>
                {loading ? (
                    <div className='flex justify-center items-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className='font-medium text-[#666e75] text-x1 mb-3'>
                                Showing Results for <span className='text-[#222328]'>
                                    {searchText}
                                </span>
                            </h2>
                        )}
                        <div className = "grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCards 
                                data= {searchedResults}
                                title='No search results found' />
                            ) : (
                                <RenderCards 
                                data = {allPosts}
                                title='No posts Found' />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Home