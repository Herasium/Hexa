<script>
    export let data;
    
    import PreviewPost from '$lib/elements/preview_post.svelte';
    import bc from "$lib/img/logo_blank.svg"
    import { onMount } from 'svelte';
    import { short_error } from "$lib/errors"
    let post = data["post"];
    
    let error

    function buy() {
        fetch("/post/buy",{
            method: "POST",
            body: JSON.stringify({
                post: post["data"]["id"]
            }),
			    headers: {
			      'Content-Type': 'application/json'
		      }
        }).then(async response => {
          return await response.json();
        }).then(data => {
          window.location.href = data.url;
        })
    }

    onMount(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      error = urlParams.get('error')
    })
</script>

<div id="big-container">
    <div id="container">
      <div id="cont-1" class="container">
        <div class="title" id="title">
          Overview Post #{post["data"]["id"]} by @{post["buyer"] ? post["buyer"]["user"] : post["profile"]["user"]}
          {#if error!=undefined}
            <div class="text small">Error: {short_error(error)}</div>
          {/if}
        </div>
      </div>
      <div id="cont-2" class="container">
        <div class="title">
          Preview
        </div>
        <div id="post-container-buy">
            <PreviewPost {post} />
        </div>
      </div>
      <div id="cont-3" class="container">
      <div class="title">
        Stats
      </div>
      <div id="stats-container">
        <div class="stat"><span class="material-symbols-outlined" id="icon-1">favorite</span> <span id="likes">{post["data"]["likes"]}</span> </div>
        <div class="stat"><span class="material-symbols-outlined" id="icon-2">visibility</span> <span id="views">{post["data"]["views"]}</span> </div>
        <div class="stat"><img src={bc} class="a-stat-blockcoin" /> <span id="blockcoin">{post["data"]["price"]}</span>  </div>
      </div>
      </div>
      <div id="cont-4" class="container">
        <div id="buy">Buy Post #{post["data"]["id"]} ?</div>
        <div id="buy-button" on:click={buy}><span id="buy-text">Buy - {post["data"]["price"] != 0 ? post["data"]["price"] : "Free"} </span><img src={bc} class="a-stat-button" /></div>
      </div>
      <div id="cont-5" class="container">
        <canvas id="canva-data"></canvas>
      </div>
    </div>
</div>

<style>
  .text {
      font-family: var(--text-font);
      font-weight: var(--text-weight-thin);
      font-size: var(--text-size-4);
      color: var(--text-color);
      margin-bottom: 50px;
    }
    
    
    .small {
      font-size: var(--text-size-2);
      font-weight: var(--text-weight-thin);
    }
    
    .a-stat-blockcoin {
      width:50px;
      height:50px;
      
    }
    .a-stat-button {
      width:37px;
      height:37px;
      margin-left:17px;
    }
    #buy {
      font-family: var(--text-font), sans-serif;
      font-weight: 500;
      font-size: var(--text-size-2);
      text-align:center;
      color: var(--text-color);
    }
    #buy-button {
      cursor:pointer;
      transition-duration: 0.5s;
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      font-size: var(--text-size-3);
      color: var(--text-color);
      border-radius: var(--global-border-radius-1);
      border: var(--global-border);
      height:auto;
      width:auto;
      text-align:center;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    #post-container-buy :global(#post) {
      width:80%;
      height:fit-content;
      min-height: 5%;
    }
    #post-container-buy {
      overflow:auto;
      scrollbar-width: thin;
      display: flex;
      justify-content:center;
      align-items:center;
      top:20%;
      height:80%;
      width:100%;
      left:0;
      position:absolute;
    }
    #canva-data{
      width:100%;
      height:100%;
    } 
    .link {
      cursor:pointer;
      border: var(--global-border);
      width: 20%;
      height: 40%;
      font-size: var(--text-size-3);
      color: var(--text-color);
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      text-align:center;
      border-radius: var(--global-border-radius-1);
      margin:5%;
      margin-top:0;
      margin-bottom:0;
      display: flex;
      justify-content:center;
      align-items:center;
    }
    #links-container {
      display: flex;
      flex-wrap: wrap;
      width:100%;
      height:70%;
      position:absolute;
      top:25%;
      left:0;
      justify-content:center;
      align-items:center;
    }
    #lb-container {
      display:flex;
      justify-content:space-evenly;
      position:absolute;
      left:0;
      flex-direction:row;
      width:100%;
      height:70%;
      top:20%;
      align-items:center;
    }
    .lb {
      font-size: var(--text-size-3);
      color: var(--text-color);
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      text-align:center;
    }
    .lb-big, #stats, #icon-1, #icon-2, #icon-3, #icon-4 {
      font-size: var(--text-size-5);
    }
    .stat {
      font-size: var(--text-size-5);
      color: var(--text-color);
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
    }
    #stats-container {
      display:flex;
      justify-content:center;
      position:absolute;
      top:0;
      left:0;
      flex-direction:column;
      width:100%;
      height:70%;
      top:20%;
      align-items:center;
    }
    #welcome {
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      color: var(--text-color);
      font-size: var(--text-size-3);
      margin-left:5px;
    }
    #balance {
      font-family: var(--text-font), sans-serif;
      font-weight: 500;
      color: var(--text-color-5);
      font-size: var(--text-size-5);
      display:flex;
      justify-content:flex-end;
      align-items:center;
      margin-left:2.5%;
      margin-right:22px;
    }
    #cont-1-5 {
      position:absolute;
      display:flex;
      justify-content:flex-start;
      align-items:center;
      top:5%;
      left:2.5%;
      width:50%;
    }
    #cont-1-8 {
      position:absolute;
      display:flex;
      justify-content:flex-start;
      align-items:center;
      top:0;
      left:0;
      width:100%;
      height:100%;
    }
    #balance img {
      width:75px;
      height:75px;
    }
    .title {
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      color: var(--text-color);
      font-size: var(--text-size-4);
      text-align:center;
      position:absolute;
      top:5%;
      left:2.5%;
    }
    #big-container {
      width:100%;
      height:100%;
      display:flex;
      justify-content:center;
      align-items:center;
      position:absolute;
      top:0;
      left:0;
    }
    #container {
      width:80%;
      height:80%;
    }
    .container {
      border: var(--global-border);
      border-radius: var(--global-border-radius-1);
      position:absolute;
    }
    #cont-1{
      width:80%;
      height:15%;
      top:15%;
      left:10%;
      display: flex;
      justify-content:center;
      align-items:center;
    }

    #cont-1 div{
      width:100%;
      position:static;
      margin:none;
    }

    #cont-1 img{
      width:65px;
      border-radius:256px;
      height:65px;
    }

    #cont-2{
      width:39.75%;
      height:29%;
      top:31%;
      left:10%;
    }
    #cont-3{
      width:39.75%;
      height:29%;
      top:31%;
      right:10%;
    }
    #cont-4{
      width:19.75%;
      height:35%;
      right:10%;
      top:61%;
      display:flex;
      align-items:center;
      justify-content: space-around;
      flex-direction:column;
    }
    #cont-5{
      width:59.75%;
      height:35%;
      left:10%;
      top:61%;
    }
</style>