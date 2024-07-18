<script>

  const pages = [
    ["-> Credits","/credits"],
    ["-> Terms of services","/tos"],
    ["-> Privacy policy","/policy"],
    ["-> Source code","https://github.com/Herasium/Hexa"],
    ["-> Help","/help"],
    ["-> Api","https://api.hexa.herasium.dev"],
    ["-> Remuneration Rate","/rate"],
    ["-> Discord","/discord"],
    ["-> Blockcoin","https://blockcoin.social"],
    ["",""],
    ["<- Main","/"]
  ]

</script>


<style>
  ul {
    list-style-type: none;
    padding: 0;
    top:7.5%;
    left:2%;
    position:fixed;
  }

  li {
    margin: 0.5em 0;
  }

  a {
    text-decoration: none;
    color: var(--text-color);
    font-family: var(--text-font);

  }

</style>

<ul>
  {#each pages as [name, url]}
    <li>
      <a href="{url}" target="{url.startsWith('http') ? '_blank' : '_self'}"> {name}</a>
    </li>
  {/each}
</ul>
