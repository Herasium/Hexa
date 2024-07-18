<script>

  import { onMount } from "svelte"
  const discord_link = "https://discord.gg/xhNNAJKfzq"

  onMount(() => {
    window.location = discord_link
  })
  
</script>

<div id="container">
  <div class="text">Redirection in progress. Please wait.</div>
  <a href = {discord_link} class="text">Click here if it didn't work</a>
</div>

<style>
  #container {
    position:fixed;
    flex-direction:column;
    top:0;
    left:0;
    height:100%;
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .text {
    color: var(--text-color);
    font-family: var(--text-font);
    font-size: var(--text-size-3)
  }
</style>
