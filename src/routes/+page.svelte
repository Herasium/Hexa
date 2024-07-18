<script>
  export let data;
	import Mockup from '$lib/img/Mockup.png';
</script>

<div class="container" id="container">
	<div class="text big">Right Here</div>
  <div class="text big">Right Now</div>
  <div class="text big">Or never</div>
	<div class="text small">Join us today on a new social journey,<br>
    and discover the world of Hexa! </div>
  {#if data.logged}
	  <div id="button" on:click={()=>{window.location.href="/explore"}}>Home</div>
  {:else}
	  <div id="button" on:click={()=>{window.location.href="/register"}}>Sign-Up!</div>
  {/if}
</div>
<div class="container-2" id="container-2">
	<img id="mockup" src={Mockup} alt="Hexa! mobile app mockup." />
</div>

<style>
    .text {
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-5);
        color: var(--text-color);
        text-align: left;
        margin-left: 7%;
    }

      
      .small {
        font-weight: var(--text-weight-thin);
        font-size: var(--text-size-2);
      }
      
      .container {
        z-index:50;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        top:0;
        left:0;
        height: 100%;
        width: 50%;
        position: absolute;
      }
      
      .container-2 {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        top:0;
        right:0;
        height: 100%;
        width: 50%;
        position: absolute;
        z-index: 4;
      }
      
      #button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--text-font);
        font-weight: var(--text-width-light);
        color: var(--text-color);
        font-size: var(--text-size-3);
        border: 1px white solid;
        background-color: rgba(255, 255, 255, 0.2);
        background-repeat: no-repeat;
        box-shadow: none;
        border-radius: 32px;
        cursor: pointer;
        width: 300px;
        height: 70px;
        z-index:100;
        margin-left: 7%;
        margin-top: 2%;
      }
      #mockup {
        height: 75%;
        width: auto;
        right: 7%;
        top:15%;
        position: absolute;
      }
    @media screen and (max-width: 1270px){
            #container {
                width: 100%; 
                height: 100%;
              }
            #container-2 {
                top: 0;
                width:100%;
                display: none;
            }
            #button {
              width: fit-content;
              height: auto ;
              background-size: cover;
              aspect-ratio: 360 / 70;
            }
          }
          

</style>
