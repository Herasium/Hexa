<script>
    import tos from "$lib/info/policy.md?raw"
    import SvelteMarkdown from "svelte-markdown";

    const source = tos
</script>

<div class="content">
     <SvelteMarkdown {source}/>
</div>

<style>
    :global(span) {
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
    }

    :global(.markdown) {
        margin: 0;
        display: block;
    }

    .content {
        top:0;
        left:0;
        position: absolute;
        word-break:break;
        z-index:10;
        width:100%;
        margin-top: 4em;
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-2);
        color: var(--text-color);
        word-wrap: break-word;
    }

    .content p {
      word-wrap: break-word;
    }


    
</style>
