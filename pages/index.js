import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
            
            <Feed posts={posts}></Feed>

        </div>
    )
}

export async function getStaticProps() {
//export async function getServerSideProps() {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const items = await res.json();

    let posts = await sweep(items);

    // let posts = [];
    // for (const element of items) {
    //     const post = await fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json`);
    //     const data = await post.json();
    //     // console.log(data.title);
    //     posts.push(data);
    // };

    console.log('posts: ' + posts);
    return {
        props: {
            posts,
        },
    }
}

async function sweep(items) {
    let posts = [];

    for (const element of items.slice(0, 10)) {
        const post = await fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json`);
        const data = await post.json();
        // console.log(data.title);
        posts.push(data);
    }

    return posts;
}