<script>
    // @ts-nocheck

    import bc from "$lib/img/logo_blank.svg";
    import { badges, titles } from "$lib/badges.js";
    import SvelteMarkdown from "svelte-markdown";
    import { onMount } from "svelte";

    export let post;
    console.log(post);

    function formatDate(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",

            minute: "2-digit",
        };
        return date.toLocaleDateString("en-EN", options);
    }
    const source = post["data"]["data"];
    let liked;

    onMount(() => {
        fetch("/post/liked", {
            method: "POST",
            body: JSON.stringify({
                post: post["data"]["id"],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (response) => {
                return await response.json();
            })
            .then((data) => {
                liked = data.liked;
            });
        fetch("/post/view", {
            method: "POST",
            body: JSON.stringify({
                post: post["data"]["id"],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    function like() {
        liked = !liked;
        post["data"]["likes"] = post["data"]["likes"] + (liked ? 1 : 0 - 1);
        fetch("/post/like", {
            method: "POST",
            body: JSON.stringify({
                post: post["data"]["id"],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
</script>

<div id="post" class="post">
    <div id="top-container">
        <a href="/profile/{post['profile']['user']}">
            <img
                id="post-img"
                class="profile-picture text"
                alt="User's profile picture."
                src={post["profile"]["profile-picture"]}
            />
        </a>
        <div id="name-container">
            <div id="line-container">
                <div id= "user-container">
                    <a id="post-user" class="text username" href="/profile/{post['profile']['user']}" >{post["profile"]["display"]}</a>
                    <div class="post-badges-container">
                        {#each post["profile"]["badges"] as badge}
                            <span
                                class="post-badge material-symbols-outlined"
                                title={titles[badge]}>{badges[badge]}</span
                            >
                        {/each}
                    </div>
                </div>
                <div class="small">{post["data"]["device"]} - {formatDate(post["data"]["date"])}</div>
            </div>
            <span class="user_id">@{post["profile"]["user"]}</span>
        </div>
        
    </div>
    <div id="post-data" class="text data"><SvelteMarkdown {source} /></div>
    <div id="post-stats" class="stats text">
        <span class="material-symbols-outlined">visibility</span>
        <span class="views">{post["data"]["views"]}</span>
        <span
            class="material-symbols-outlined like-button {liked ? 'liked' : ''}"
            on:click={like}>favorite</span
        >
        <span class="likes">{post["data"]["likes"]}</span>
        <span
            class="material-symbols-outlined comment-button"
            on:click={(window.location.href = "/post/" + post["data"]["id"])}
            >chat</span
        >
        <span class="comment">{post["data"]["comments_number"]}</span>
    </div>
</div>

<style>
    .user_id {
        font-size: var(--text-size-1);
        color: var(--text-second-color) !important;
        font-family: var(--text-font);
    }

    .small {
        font-size: var(--text-size-1);
        color: var(--text-second-color) !important;
        font-family: var(--text-font);
        margin-top: 10px;
    }

    .like-button {
        transition-duration: 0.5s;
        cursor: pointer;
    }
    .comment-button:hover {
        font-size: 26px;
    }
    .comment-button {
        transition-duration: 0.5s;
        cursor: pointer;
    }
    .like-button:hover {
        font-size: 26px;
    }
    .a-blockcoin:hover {
        transition-duration: 0.5s;
        cursor: pointer;
        width: 26px;
        height: 26px;
    }
    .liked {
        color: #ff0000;
        font-variation-settings:
            "FILL" 1,
            "wght" 400,
            "GRAD" 0,
            "opsz" 24;
    }
    #post {
        background: var(--post-background);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border: var(--post-border);
        border-radius: var(--post-radius);
    }
    .post-badge {
        font-size: var(--text-size-3);
        color: var(--badge-color);
        border: var(--badge-border);
        background: var(--badge-background);
        border-radius: var(--badge-radius);
    }
    .post-badges-container {
        width: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 10px;
        margin-bottom: 0;
        border: var(--badge-border);
        border-radius: var(--badge-raduis);
        background: var(--badge-background);
    }
    #name-container {
        width: 95%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }
    #user-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
    }
    #line-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .text {
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        word-wrap: break-word;
    }

    #post-img {
        cursor: pointer;
        border-radius: 256px;
        width: 48px;
        height: 48px;
        margin: 10px;
    }

    #post-user,
    #first-post-user {
        margin-top: 10px;
        margin-left: 0;
        margin-right: 0;
        cursor: var(--text-link-cursor);
        text-decoration: var(--text-link-decoration);
    }

    #post-user {
        margin-right: 5px;
    }

    #top-container {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
    }

    #post-meta {
        margin: 10px;
        font-weight: 300;
        font-size: var(--text-size-2);
    }
    #post-stats {
        margin: 10px;
        bottom: 0;
        position: relative;
        right: 0;
        text-align: right;
        font-weight: 300;
        font-size: var(--text-size-2);
    }
    #post-data p {
        margin: 10px;
        white-space: pre;
        word-break: break-word;
        font-size: var(--text-size-2);
        width: 100%;
    }
</style>
