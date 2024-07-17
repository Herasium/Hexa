<script>
    import bc from "$lib/img/logo_blank.svg"
</script>

<div id="cont-1" class="container">
    <h1 class="text title">Revenue Rules</h1>
    <div id="rules">
        <div class="text rule">1 <span class="material-symbols-outlined icon">visibility</span> = 0.1 <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." /></div>
        <div class="text rule">1 <span class="material-symbols-outlined icon">favorite</span> = 1.0 <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." /></div>
        <div class="text rule">1 <span class="material-symbols-outlined icon">person</span> = 3.0 <img class="blockcoin" src={bc} alt="A white version of the blockcoin logo." /></div>
    </div>
    <div class="text thing">When you are soft banned, you cannot use the blockcoin currency, as in you cannot send blockcoins, you cannot buy posts and you cannot earn blockcoin.</div>
    <div class="text thing">Here is a couple things that can get you soft banned:</div>
    <div class="text thing">- Scamming</div>
    <div class="text thing">- Spamming</div>
    <div class="text thing">- Profanity</div>
    <div class="text thing">- Hacking</div>
    <div class="text thing">- Inappropiate Pfps / Banners</div>
</div>

<style>
    .container {
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
        text-align: center;
        width: 100%;
    }

    #rules {
        margin-top: 5%;
    }

    .rule {
        font-size: var(--text-size-3);
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    }

    .thing {
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    }

    .icon {
        font-size: var(--text-size-3);      
    }

    .blockcoin {
        width: var(--text-size-3);
        border-radius: 100%;
        margin-left: 10px;
    }
</style>