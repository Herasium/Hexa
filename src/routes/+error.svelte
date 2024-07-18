<script>
	import { page } from '$app/stores';
</script>

<div id="center-contain">
    <div id="error-code"> {$page.status} </div>
    <h3> {$page.error.message} </h3>
    <a class="button" href="/" id="home">Home</a>
</div>

<style>
#center-contain {
    z-index:0;
    width: 100%;
    height: 100%;
    position:absolute;
    top:0;
    left:0;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
}

#error-code {
    text-align: center;
    font-family: var(--text-font), sans-serif;
    font-size: var(--text-size-6);
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    color: var(--text-color);
    -webkit-background-clip: text;
}

h3 {
    font-family: var(--text-font), sans-serif;
    color: var(--text-color);
    text-align: center;
    font-weight: 400;
}

.button {
  position:relative;
  cursor:pointer;
  color: var(--text-color);
  font-family: var(--text-font), sans-serif;
  font-size: var(--text-size-4);
  font-weight: 400;
  z-index: 10;
}

#home {
  position:relative;
  cursor:pointer;
  color: var(--text-color);
  font-family: var(--text-font), sans-serif;
  font-size: var(--text-size-4);
  font-weight: 400;
  z-index: 10;
}

a {
    cursor: pointer;
    text-decoration: none;
}
</style>
