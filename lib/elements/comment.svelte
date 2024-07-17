<script>
    // @ts-nocheck
    
    import bc from "$lib/img/logo_blank.svg"
    import {badges,titles} from "$lib/badges.js"
    import SvelteMarkdown from 'svelte-markdown'
    import { onMount } from 'svelte'

    import Reply from './comment.svelte'
    import CreateComment from "$lib/elements/create_comment.svelte"

    export let comment 
    export let root
    export let isreply
    let reply = false
    let path = root + (isreply ? "/replies/" : "/comments/") + comment["data"]["id"];
    
    function formatDate(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 

            minute: '2-digit'
        };
        return date.toLocaleDateString('en-EN', options);
    }
    const source = comment["data"]["data"]
    let liked;
    
    onMount(() => {
        fetch("/post/comment/liked",{
            method: "POST",
            body: JSON.stringify({
                refrence: path
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async response => {
            return await response.json();
        }).then(data => {
            liked = data.liked;
        })
    })

    function like() {
        liked = !liked;
        comment["data"]["likes"] = comment["data"]["likes"] + (liked ? 1 : (0 - 1))
        fetch("/post/comment/like",{
            method: "POST",
            body: JSON.stringify({
                refrence: path
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
</script>

{#if reply}
    <CreateComment replying={true} replier={path} />
{/if}
<div id="comment" class="comment">
    <div id="top-container">
        <a href="/profile/{comment["profile"]["user"]}">
            <img id="comment-img" class="profile-picture text" alt="User's profile picture." src={comment["profile"]["profile-picture"]}/>
        </a>
        <a id="comment-user" class="text username" href="/profile/{comment["profile"]["user"]}">{comment["profile"]["display"]}</a>
        <div class="comment-badges-container">
            {#each comment["profile"]["badges"] as badge}
                <span class="comment-badge material-symbols-outlined" title="{titles[badge]}">{badges[badge]}</span>
            {/each}
        </div>
    </div>
    <div id="comment-data" class="text data"><SvelteMarkdown {source} /></div>
    <div id="comment-meta" class="text timestamp" >BlockCoin Browser App - {formatDate(comment["data"]["date"])}</div>
    <div id="comment-stats" class="stats text">
        <span class="material-symbols-outlined like-button {liked ? "liked" : ""}" on:click={like}>favorite</span> 
        <span class="likes">{comment["data"]["likes"]}</span>
        <div id="reply-button" class="text" on:click={()=>{reply = true}}><span class="material-symbols-outlined">reply</span> Reply </div>
    </div>
</div>
<div id="comment-reply">
    {#each (comment["data"]["replies"] || []) as comment}
        <Reply {comment} root={path} isreply={true}/>
    {/each}
</div>


<style>
    .like-button {
        transition-duration: 0.5s;
        cursor:pointer;
    }
    .like-button:hover {
        font-size: 26px;
    }

    .liked {
        color:#FF0000;
        font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
    }
    #reply-button {
        cursor:pointer;
        transition-duration: 0.5s;
        height:auto;
        width:auto;
        text-align:center;
        width:fit-content;
      }
    #comment-reply {
        width:90%;
        height: fit-content;
    }
    #comment {
        background: var(--comment-background);
        width:100%;
        height: 100%;
        top:0;
        left:0;
        border: var(--comment-border);
        border-radius: var(--comment-radius)
    }
    .comment-badge {
        font-size: var(--text-size-3);
        color: var(--badge-color);
        border: var(--badge-border);
        background: var(--badge-background);
        border-radius: var(--badge-radius);
      }
    .comment-badges-container {
        width:fit-content;
        display:flex;
        flex-direction:row;
        justify-content:flex-start;
        align-items:center;
        margin:10px;
        border:var(--badge-border);
        border-radius:var(--badge-raduis);
        background: var(--badge-background);
      }
      .text {
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        word-wrap: break-word
    }


    #comment-img {
        cursor:pointer;
        border-radius:256px;
        width: 48px;
        height: 48px;
        margin: 10px;
    }

    #comment-user, #first-comment-user {
        margin: 10px;
        margin-left:0;
        margin-right:0;
        cursor: var(--text-link-cursor);
        text-decoration: var(--text-link-decoration);
    }

    #comment-user {
        margin-right: 5px;
    }

    #top-container {
        position:relative;
        top:0;
        left:0;
        width:100%;
        height:fit-content;
        display:flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
    
    }

    #comment-meta {
        margin: 10px;
        font-weight: 300;
        font-size: var(--text-size-2);
    }
    #comment-stats {
        margin: 10px;
        bottom:0;
        position:relative;
        right:0;
        text-align:right;
        font-weight: 300;
        font-size: var(--text-size-2);
    }
    #comment-data {
        margin: 10px;
        white-space: pre;
    }
</style>
