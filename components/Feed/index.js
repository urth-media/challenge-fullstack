import { useState } from 'react'
import styles from './feeds.module.css'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { offsetLimitPagination } from "@apollo/client/utilities";

const Feed = ({ posts }) => {
    const [data, setData] = useState(posts);
    // const [ini, setIni] = useState(0);
    // const [end, setEnd] = useState(10);
    const [page, setPage] = useState(1)
    console.log('Initial page: ' + page);

    const fetchData = async page => {
        let items = await sweep(page);
        setData(items);
    };

    const handleClick = async event => {
        event.preventDefault();
        await fetchData();
    };

    const handleNext = async event => {
        event.preventDefault();
        await next();
    }

    const handlePrev = event => {
        event.preventDefault();
        prev();
    }

    const next = async () => {
        if (page < 50) {
            // setIni(ini + 10);
            // setEnd(end + 10);
            setPage(page + 1);
            let items = await sweep(page);
            setData(items);
        }
    }

    const prev = async () => {
        if (page > 0) {
            // setIni(ini - 10);
            // setEnd(end - 10);
            setPage(page - 1)
            let items = await sweep(page);
            setData(items);
        }
    }

    const handleComments = event => {
        event.preventDefault();
        console.log('HANDLE COMMENTS CLICKED');
    }

    return (
        <div>
            <p><button onClick={handleClick}>Fetch data</button></p>
            <p>Page: {page}</p>
            <ul className={styles.noBullet}>
                {
                    data?.map((post, i) => {
                        return (<li key={i}>
                            <a href={post.url} target="_blank">{post.title}</a>
                            <div className={styles.miniText}>
                                {post.type}{' '}by{' '}{post.by}
                            </div>
                            <p className={styles.contentText}>{post.text}</p>
                            <div className={styles.commentSection}>
                                <a className="btn btn-sm btn-primary" data-bs-toggle="collapse" 
                                    href={"#collapseComments" + post.id} role="button" aria-expanded="false" 
                                    aria-controls={"collapseComments" + post.id}
                                    onClick={handleComments}>
                                    Toggle comments
                                </a>
                                <div className="collapse" id={"collapseComments" + post.id}>
                                    <div className="card card-body">
                                        <ul>
                                            {post?.comments?.map((item, x) => {
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
            <p>Page: {page}</p>
            <p><button onClick={handlePrev}>{' < '}</button>{'  '}<button onClick={handleNext}>{' > '}</button></p>
        </div>
    );
}

async function sweep(page) {
    let posts = [];

    const options = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }

    let gqlClient = new ApolloClient({
        uri: 'http://localhost:8081/query',
        cache: new InMemoryCache(),
    });

    console.log('about to run gql query...');
    const res = await gqlClient.query({
        query: gql`
            query Items {
                items(page: ${page}) {
                    id
                    type
                    title
                    by
                    text
                    url
                    comments {
                        text
                    }
                }
            },
        `,
        //variables: {page: page },
    });
    console.log('finished gql query;');

    //console.log(res);
    //const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    // const items = await res.json();
    // console.log('The Items: ' + items);

    // for (const element of items) {
    //     const post = await fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json`);
    //     const postData = await post.json();
    //     console.log(postData.title);
    //     posts.push(postData);
    // };

    // for (const element of res.data.items) {
    //     console.log(element);
    //     posts.push(element);
    // }

    let query = {
        "query": "query GetItems ($offset: Int, $limit: Int) { items (offset: $offset, limit: $limit) { id, title, by, text, url, kids } }",
        "operationName": "GetItems",
        "variables": { "page": page }
    };

    posts = res.data.items;
    console.log(posts);
    console.log(posts.length);
    return posts;
}

export async function  getServerSideProps() {
    console.log(' getServerSideProps ');
    let posts = await sweep(1);
    
    return {
        props: {
            posts,
        },
    };
}

export default Feed;