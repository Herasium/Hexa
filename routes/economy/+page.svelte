<script>
    export let data;
    import bc from "$lib/img/logo_blank.svg"
    import { onMount } from 'svelte';
    import { short_error } from "$lib/errors"

    let error;

    let history = data.economy.history;
    let user;
    let amount;

    function send() {
        fetch("/economy/send",{
            method: "POST",
            body: JSON.stringify({
                username: user,
                amount
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

<div id="cont-1" class="container">
    <h1 class="text title">Transaction<br>History</h1>
    <div id="history-container">
        {#each history as transaction}
            {#if transaction.type == "from"}
                <div class="transaction">
                    <div class="transaction-desc">
                        <img class="transaction-pfp" src={transaction["profile-picture"]} alt="User's profile picture" />
                        <div class="transaction-text"><p>From {transaction.username}</p></div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-text"><p style="width: 100%;">{transaction.amount}</p></div>
                        <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." />
                    </div>
                </div>
            {:else if transaction.type == "to"}
                <div class="transaction">
                    <div class="transaction-desc">
                        <img class="transaction-pfp" src={transaction["profile-picture"]} alt="User's profile picture" />
                        <div class="transaction-text"><p>To {transaction.username}</p></div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-text"><p style="width: 100%;">{transaction.amount}</p></div>
                        <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." />
                    </div>
                </div>
            {:else if transaction.type == "post"}
                <div class="transaction">
                    <div class="transaction-desc">
                        <div class="transaction-text"><p>Post Revenue</p></div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-text"><p style="width: 100%;">{transaction.amount}</p></div>
                        <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." />
                    </div>
                </div>
            {:else if transaction.type == "comment"}
                <div class="transaction">
                    <div class="transaction-desc">
                        <div class="transaction-text"><p>Comment Revenue</p></div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-text"><p style="width: 100%;">{transaction.amount}</p></div>
                        <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." />
                    </div>
                </div>
            {/if}
        {/each}
    </div>
    <div id="see-all" class="text" on:click={() => {window.location.href = "/economy/history"}}>See All</div>
</div>
<div id="cont-2" class="container">
    <div id="balance">Balance: {Math.floor(data.economy.user["balance"] * 10) / 10} <img src={bc} alt="A white version of the blockcoin logo." id="currency"/></div>
</div>
<div id="cont-3" class="container">
    <h1 class="text title">Send</h1>
    {#if error!=undefined}
        <div class="text error">Error: {short_error(error)}</div>
    {/if}
    <div id="send-container">
        <div class="input text"><p style="text-align: left; display: inline-block; margin: 0;font-size: 40px;" class="material-symbols-outlined">person</p><input class="real-input text" bind:value={user} />To Who</div>
        <div class="input text" style="margin-bottom: 20%;"><img class="a-blockcoin" src={bc} alt="A white version of the blockcoin logo." /><input type="number" class="real-input text" style="width: calc(30% - 20px);" bind:value={amount} />How Much</div>
        <div class="button" on:click={send}><p>Send</p></div>
    </div>
</div>
<div id="cont-4" class="container">
    <h1 class="text title">Quick Links</h1>
    <div id="links-container">
      <div class="link" on:click={()=>{window.location.href = "/report"}}><p>Report</p></div>
      <div class="middle-link" on:click={()=>{window.location.href = "/economy/rules"}}><p>Revenue<br>Rules</p></div>
      <div class="link" on:click={()=>{window.location.href = "/premium"}}><p>Premium</p></div>
    </div>
</div>

<style>
    .container {
        border: var(--global-border);
        border-radius: var(--global-border-radius-2);
        position:absolute;
    }

    #cont-1 {
        width: 30%;
        height: 78%;
        top: 10%;
        left: 10%;
    }

    #cont-2 {
        width: 50%;
        height: 39%;
        top: 10%;
        left: calc(40% + 5px);
    }

    #cont-3 {
        width: 25%;
        height: calc(39% - 5px);
        top: calc(49% + 5px);
        left: calc(40% + 5px);
    }

    #cont-4 {
        width: 25%;
        height: calc(39% - 5px);
        top: calc(49% + 5px);
        left: calc(65% + 10px);
    }

    .text {
        font-family: var(--text-font), sans-serif;
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        margin: 0;
    }

    .error {
      font-weight: var(--text-weight-thin);
      width: 100%;
      text-align: center;
      position: absolute;
    }
    
    .title {
        font-weight: var(--text-weight-thin);
        font-size: var(--text-size-3-5);
        text-align: center;
        width: 100%;
    }

    #history-container {
        width: calc(100% - 60px);
        padding: 30px;
        height: calc(73% - 55px);
        position: relative;
        overflow: hidden;
    }

    #see-all {
        width: 100%;
        height: 20px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }
    
    .transaction {
        font-family: var(--text-font), sans-serif;
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-1);
        color: var(--text-color);
        width: calc(100% - 40px);
        border-radius: 40px;
        height: 40px;
        padding: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border: var(--global-border);
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
    }

    .transaction-pfp {
        width: 40px;
        border-radius: 5px;
        margin-right: 10px;
    }

    .transaction-text {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .transaction-desc {
        width: 60%;
        display: flex;
        flex-direction: row;
    }

    .transaction-amount {
        height: 100%;
        text-align: right;
        width: calc(40% - 5px);
        display: flex;
    }

    .blockcoin {
        width: 40px;
        border-radius: 100%;
        margin-left: 10px;
    }

    .a-blockcoin {
        width: 40px;
        border-radius: 100%;
    }
    
    #balance {
      font-family: var(--text-font), sans-serif;
      font-weight: 500;
      color: var(--text-color);
      font-size: var(--text-size-5);
      display:flex;
      justify-content:center;
      align-items:center;
      height: 100%;
    }

    #currency {   
      width:var(--text-size-5);
      border-radius:100%;
      height:var(--text-size-5);
      margin-left: 5px;
    }

    #send-container {
        height: 60%;
        padding: 11%;
        width: 60%;
        padding-left: 20%;
        padding-right: 20%;
        padding-top: 10px;
        position: relative;
    }

    .input {
        width: 100%;
        height: calc(15% + 3px);
        border-bottom: var(--global-border);
        text-align: right;
        display: flex;
        flex-direction: row;
        margin-bottom: 15%
    }

    .real-input {
        width: calc(70% - 20px);
        background: transparent;
        border: none;
        height: 100%;
        margin-left: 10px;
        margin-right: 10px;
    }

    .real-input:focus {
        outline: none;
    }
    
    #links-container {
        width: 60%;
        padding: 20%;
        padding-top: 0;
        height: 60%;
    }

    .link, .button {
      cursor:pointer;
      border: var(--global-border);
      width: 100%;
      height: calc(33% - 10px);
      font-size: var(--text-size-3);
      color: var(--text-color);
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      text-align:center;
      border-radius: var(--global-border-radius-1);
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content:center;
      align-items:center;
    }

    .middle-link {
      cursor:pointer;
      border: var(--global-border);
      width: 100%;
      height: calc(50% - 10px);
      font-size: var(--text-size-3);
      color: var(--text-color);
      font-family: var(--text-font), sans-serif;
      font-weight: 400;
      text-align:center;
      border-radius: var(--global-border-radius-1);
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content:center;
      align-items:center;
    }

    input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
         -webkit-appearance: none;
      }
</style>