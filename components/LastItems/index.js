import { useState } from 'react'
import styles from './lastitems.module.css'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { offsetLimitPagination } from "@apollo/client/utilities";

const LastItems = ({ lastItems }) => {
    const [data, setData] = useState([]);
    const [fromId, setFromId] = useState(0);
    const [count, setCount] = useState(0);

    const fetchData = async id => {
        let items = await getItems(fromId, count);
        setData(items);
    };

    const handleGetItems = async event => {
        event.preventDefault();
        let id = document.getElementById('edtStory');
        await fetchData(fromId, count);
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
            {/* <p><input type="text" id="edtStory" value={storyId} onChange={handleInputChange}></input></p> */}
            <p><button className="btn btn-sm btn-primary" onClick={handleGetItems}>Get items</button></p>
            <div id="spinner" className="spinner-border text-primary" 
                style={{display: 'none'}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <ul className={styles.noBullet}>
                {
                    data?.map((post, i) => {
                        return (<li key={i}>
                            <a href={post.story?.url} target="_blank">{post.story?.title}</a>
                            <div className={styles.miniText}>
                                {post.itemType}{' '}by{' '}{post.story?.author}
                            </div>
                            <p className={styles.contentText}>{post.story?.text}</p>
                            <div className={styles.commentSection}>
                                <a className="btn btn-sm btn-primary" data-bs-toggle="collapse" 
                                    href={"#collapseComments" + post.story?.id} role="button" aria-expanded="false" 
                                    aria-controls={"collapseComments" + post.id}
                                    onClick={handleComments}>
                                    Toggle comments
                                </a>
                                <div className="collapse" id={"collapseComments" + post.id}>
                                    <div className="card card-body">
                                        <ul>
                                            {post?.conversation?.comments?.map((item, x) => {
                                                return <li key={x} className={styles.miniText}>{item.text}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>)
                    })
                }
            </ul>
        </div>
    );
}

async function getItems(fromId, count) {
    let spinner = document.getElementById('spinner');
    spinner.style.setProperty('display', 'none');

    let items = [];

    let gqlClient = new ApolloClient({
        uri: 'http://localhost:8080/query',
        cache: new InMemoryCache(),
    });

    spinner.style.setProperty('display', 'block');

    //console.log("Gonna run the query");
    console.log('params: from id: ' + fromId + '   count: ' + count);
    const res = await gqlClient.query({
        query: gql`
            query LastItems {
                LastItems(filter: { 
                        start_from_id: ${fromId}
                        count: ${count}
                    }) {
                    itemType
                    id
                    story {
                        title
                        url
                        author
                    }
                    conversation {
                        comments {
                            id
                            text
                        }
                    }
                }
            },
        `,
        //variables: {page: page },
    });

    console.log(res.data.LastItems);
    items = res.data.LastItems;
    spinner.style.setProperty('display', 'none');
    return items;
}

export default LastItems;