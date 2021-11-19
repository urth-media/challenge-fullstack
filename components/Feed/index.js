import { useState } from 'react'
import styles from './feeds.module.css'

const Feed = ({ posts }) => {
    const [data, setData] = useState(posts);
    const [ini, setIni] = useState(0);
    const [end, setEnd] = useState(10);

    const fetchData = async page => {
        let items = await sweep(ini, end);

        setData(items);
        console.log('items.length: ' + items.length);
        console.log(`ini: ${ini}    end: ${end}`);
    };

    const handleClick = event => {
        event.preventDefault();
        fetchData();
    };

    const handleNext = event => {
        event.preventDefault();
        next();
    }

    const handlePrev = event => {
        event.preventDefault();
        prev();
    }

    const next = async () => {
        if (end < 500) {
            setIni(ini + 10);
            setEnd(end + 10);
            let items = await sweep(ini, end);
            setData(items);
            console.log(`ini: ${ini}    end: ${end}`);
        }
    }

    const prev = async () => {
        if (ini > 0) {
            setIni(ini - 10);
            setEnd(end - 10);
            let items = await sweep(ini, end);
            setData(items);
            console.log(`ini: ${ini}    end: ${end}`);
        }
    }

    return (
        <div>
            <p><button onClick={handleClick}>Fetch data</button></p>
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
                                    aria-controls={"collapseComments" + post.id}>
                                    Toggle comments
                                </a>
                                <div className="collapse" id={"collapseComments" + post.id}>
                                    <div className="card card-body">
                                        <ul>
                                            {post?.kids?.map((item, x) => {
                                                return <li key={x}>{item}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>)
                    })
                }
            </ul>
            <p><button onClick={handlePrev}>{' < '}</button>{'  '}<button onClick={handleNext}>{' > '}</button></p>
        </div>
    );
}

async function sweep(start, end) {
    let posts = [];

    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const items = await res.json();

    for (const element of items.slice(start, end)) {
        const post = await fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json`);
        const postData = await post.json();
        console.log(postData.title);
        posts.push(postData);
    };

    return posts;
}

export default Feed;