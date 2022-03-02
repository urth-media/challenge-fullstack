import { useState } from 'react'
import styles from './story.module.css'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { offsetLimitPagination } from "@apollo/client/utilities";

const Story = ({ story }) => {
    const [data, setData] = useState({});
    const [storyId, setStoryId] = useState(0);

    const fetchData = async id => {
        let item = await getStory(id);
        setData(item);
    };

    const handleGetStory = async event => {
        event.preventDefault();
        let id = document.getElementById('edtStory');
        await fetchData(storyId);
    };

    const handleInputChange = event => {
        event.preventDefault();
        let id = document.getElementById('edtStory');
        setStoryId(event.target.value);
        console.log(event.target.value);
    }

    const handleComments = event => {
        event.preventDefault();
        console.log('HANDLE COMMENTS CLICKED');
    }
    
    return (
        <div>
            <p><input type="text" id="edtStory" value={storyId} onChange={handleInputChange}></input></p>
            <p><button className="btn btn-sm btn-primary" onClick={handleGetStory}>Get story</button></p>
            <div id="spinner" className="spinner-border text-primary" 
                style={{display: 'none'}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div>
                {
                    <>
                    <p>{data.title}</p>
                    <p><a href={data.url} target="_blank">{data.url}</a></p>
                    <p>{'story by '}{data.author}</p>
                    <p>{'score '}{data.score}</p>
                    </>
                }
            </div>
        </div>
    );
}

async function getStory(id) {
    let spinner = document.getElementById('spinner');
    spinner.style.setProperty('display', 'none');

    let story = {};

    let gqlClient = new ApolloClient({
        uri: 'http://localhost:8080/query',
        cache: new InMemoryCache(),
    });

    spinner.style.setProperty('display', 'block');

    const res = await gqlClient.query({
        query: gql`
            query GetStory {
                GetStory(filter: { id: ${id}}) {
                    id
                    title
                    text
                    url
                    author
                    score
                    commentsCount
                }
            },
        `,
        //variables: {page: page },
    });

    story = res.data.GetStory;
    spinner.style.setProperty('display', 'none');
    return story;
}

export default Story;