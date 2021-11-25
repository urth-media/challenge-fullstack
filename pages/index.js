import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
//import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import styles from '../styles/Home.module.css'
import Feed from '../components/Feed'

export default function Home({ posts }) {
    // { console.log(posts.length); }

    return (
        <div className={styles.container}>
            <Head>
                <title>HN Client</title>
            </Head>
            <h2>Urth - Fullstack challenge</h2>

            <Link href='/about'>
                <a>About</a>
            </Link>

            {/* <p><button onClick={remove}>Remove all</button></p>

            <ul>
                {posts.map((post, i) => (
                    <li key={i}>{post.title}</li>
                ))}
            </ul> */}
            
            <Feed posts={[]}></Feed>

        </div>
    )
}

//export async function getStaticProps() {
// export async function getServerSideProps() {
//     const options = {
//         watchQuery: {
//             fetchPolicy: 'no-cache',
//             errorPolicy: 'ignore',
//         },
//         query: {
//             fetchPolicy: 'no-cache',
//             errorPolicy: 'all',
//         },
//     }

//     const gqlClient = new ApolloClient({
//         uri: 'http://localhost:8081/query',
//         cache: new InMemoryCache(),
//         defaultOptions: options,
//         // fetchOptions: {
//         //     mode: 'no-cors',
//         // },
//     });

//     console.log('about to run gql query...');
//     const res = await gqlClient.query({
//         query: gql`
//             query Items {
//                 items(ini: 0, end: 10) {
//                     id
//                     type
//                     title
//                     by
//                     text
//                     url
//                     kids
//                 }
//             }
//         `
//     });

//     let posts = res.data.items;

//     console.log('posts: ' + posts);
//     return {
//         props: {
//             posts,
//         },
//     }
// }

// async function sweep(items) {
//     let posts = [];

//     for (const element of items.slice(0, 10)) {
//         const post = await fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json`);
//         const data = await post.json();
//         // console.log(data.title);
//         posts.push(data);
//     }

//     return posts;
// }