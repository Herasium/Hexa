<script>
    export let text;
    let spoiling = false;
</script>

<div class="spoiler{spoiling ? "" : " covering"}">
    {#if !spoiling}
        <div class="cover" on:click={()=>{spoiling = true}}>
            {text}
        </div>
    {:else}
        {text}
    {/if}
</div>


<style>
    .spoiler {
        border-radius: 10px;
        padding: 5px;
        background: gray;
        width: fit-content;
    }

    .covering {
        padding: 0;
    }

    .cover {
        border-radius: 10px;
        padding: 5px;
        background: rgb(70, 70, 70);
        color: rgb(70, 70, 70);
        z-index: 10;
        width: fit-content;
        user-select: none;
        cursor: pointer;
    }
</style>