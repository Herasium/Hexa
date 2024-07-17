<script>
    export let data;
    import bc from "$lib/img/logo_blank.svg"

    let history = data.economy.history;
</script>

<div id="cont-1" class="container">
    <h1 class="text title">Transaction History</h1>
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
</div>

<style>
    .container {
        border: var(--global-border);
        border-radius: var(--global-border-radius-2);
        position:absolute;
    }

    #cont-1 {
        width: 80%;
        height: 78%;
        top: 10%;
        left: 10%;
    }

    .text {
        font-family: var(--text-font), sans-serif;
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        margin: 0;
    }
    
    .title {
        font-weight: var(--text-weight-thin);
        font-size: var(--text-size-3-5);
        position:absolute;
        text-align: center;
        width: 100%;
    }

    #history-container {
        width: calc(100% - 850px);
        padding: 30px;
        padding-left: 425px;
        padding-right: 425px;
        height: calc(92% - 60px);
        position: relative;
        top: 8.26%;
        overflow: auto;
        overflow-x: hidden;
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
</style>