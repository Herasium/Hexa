<script>
  export let nav
  import bc_logo from "$lib/img/logo.png"
  import CreatePost from "$lib/elements/create_post.svelte";

  let type = false

  let text = "add"

  function change_text() {
      type = !type
      if (!type) {text = "add"}
      else {text = "close"}
  }
</script>

  <img
      src={bc_logo}
      id="logo"
      alt="Blockcoin's logo, in the form of a coin."
      on:click={()=>{window.location.href = "/"}}
/>

{#if type}
  <CreatePost /> 
{/if}

<div id="pastille">
  {#if nav.logged}
      <span class="material-symbols-outlined" on:click={change_text}>{text}</span>
      <span class="material-symbols-outlined">home</span>
      <span class="material-symbols-outlined">search</span>
      <span class="material-symbols-outlined">notifications</span>
      <span class="material-symbols-outlined">settings</span>
      <img
      src={nav.profile["profile-picture"]}
      id="profile"
      class="logged"
      alt="User's profile"
      on:click={()=>{window.location.href = "/dashboard"}}
      />
  {:else}
      <a class="trans-button" id="register" href="/register">Sign-Up!</a>
      <a class="trans-button" id="login" href="/login">Login</a>
      <a class="trans-button" id="explore" href="/trending">More</a>
  {/if}
</div>


<style>
        #navbar {
          backdrop-filter: blur(var(--navbar-blur));
          z-index:99;
          position: fixed;
          top:0;
          left:0;
          width:100%;
          height:7.5%;
          background:var(--navbar-background);
          border: var(--navbar-border);
          border-radius: var(--navbar-border-radius);
        }
        
        #logo {
          margin-left:2.5%;
          width: auto;
          height: var(--navbar-height);
          display:block;
          cursor:pointer;
          object-fit: cover;
          z-index:100;
          position: fixed;
          top:1%;
          left:0;
          content: var(--logo-url)
        }

        #pastille {
          z-index:100;
        }

        #pastille a{
          margin-left: 5px;
          margin-right: 5px;
        }

        #pastille span{
          margin-left: 7.5px;
          margin-right: 7.5px;
        }
        
        #profile {
          border-radius:256px;
          object-fit: cover;
          position:relative;
          width: auto;
          height: var(--picture-size);
          display:block;
          cursor:pointer;
          z-index:100;
          height:80%;
          margin-right: 7.5px;
        }

        .trans-button {
          position:relative;
          color: var(--text-color);
          font-family: var(--text-font);
          font-size: var(--text-size-2);
          font-weight: var(--text-weight-normal);
          z-index:100;
          cursor: var(--text-link-cursor);
          text-decoration: var(--text-link-decoration);
        }

        #register {
          font-size: var(--text-size-3);
        }

        .container-3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap:30px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top:0;
          left:0;
          width:100%;
          height:7.5%;
          z-index: 99;
        }
        @media screen and (min-width: 550px){
          #pastille {
          margin-right:2.5%;
          z-index:100;
          position: fixed;
          height: var(--navbar-height);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          top:1%;
          right:0;
          border: var(--pastille-border);
          border-radius: var(--pastille-border-radius);
          background-color: var(--pastille-background-color);
        }
        }
        @media screen and (max-width: 550px){
        .container-3 {
          display: flex;
          justify-content: space;
          align-items: center;
          gap:30px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top:92.5%;
          left:0;
          width:100%;
          height:7.5%;
          background-color: black;
          z-index: 99;
          backdrop-filter: blur(var(--navbar-blur));
          border-radius: var(--navbar-border-radius);
          background:var(--navbar-background);
          border: var(--navbar-border);
        }
        .trans-button {
          position:relative;
          cursor:pointer;
          color: var(--text-color);
          font-family: var(--text-font);
          font-size: var(--text-size-3);
          font-weight: var(--text-weight-normal);
          z-index:100;
        }
        #navbar {
          display: none;
        }
        #pastille {
          z-index:100;
          position: fixed;
          height: var(--navbar-height);
          display: flex;
          justify-content: center;
          align-items: center;
          border: var(--pastille-border);
          border-radius: var(--pastille-border-radius);
          background-color: var(--pastille-background-color);
          bottom: 0;
          left:0;
          width: 100%;
          margin: 0;
          top: none;
        }
        #logo {display:none;}
        #profile {display:none;}
        }

</style>
