<script>
    export let data;
    
    import Post from '$lib/elements/post.svelte';
    import Comment from '$lib/elements/comment.svelte';
    import CreateComment from "$lib/elements/create_comment.svelte";
    let post = data["post"];
    let comment = false;
</script>

{#if comment}
    <CreateComment replying={false} replier={post["data"]["id"]} />
{/if}
<div class="post-container">
    <Post {post} />
    <div class="title">Comments <div id="new-button" on:click={()=>{comment = true}}><span class="material-symbols-outlined">add</span> New Comment </div> </div>
    {#each (post["data"]["comments"] || []) as comment}
        <Comment {comment} root={"/Posts/" + post["data"]["id"]} isreply={false}/>
    {/each}
</div>

<style>
    .post-container {
        width: 80%;
        position: absolute;
        left: 10%;
        top: 7.5%;
    }
    .title {
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        width: 60%;
    }
    #new-button {
        cursor: pointer;
        transition-duration: 0.5s;
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        height: auto;
        width: auto;
        text-align: center;
        width: fit-content;
    }
</style>