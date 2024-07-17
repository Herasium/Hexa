<script>
    import tos from "$lib/info/tos.md?raw"

    // Yay my markdown stuff from tiw that i made by myself
    function MarkdownToHtml(string) {
        let mdString = string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        // Convert headers
        mdString = mdString.replace(/^#\s+(.*)$/gm, '<h1 class="markdown">$1</h1>');
        mdString = mdString.replace(/^##\s+(.*)$/gm, '<h2 class="markdown">$1</h2>');
        mdString = mdString.replace(/^###\s+(.*)$/gm, '<h3 class="markdown">$1</h3>');
 
        // Convert bold, italic and code blocks
        mdString = mdString.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        mdString = mdString.replace(/\*(.*?)\*/g, '<em>$1</em>');
        mdString = mdString.replace(/\_(.*?)\_/g, '<em>$1</em>');
        mdString = mdString.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="markdown-link" href="$2" target=_blank>$1</a>');
        mdString = mdString.replace(/```([\s\S]*?)```/g, '<code>$1</code>');
 
        // Convert lists
        mdString = mdString.replace(/^\s*-\s+(.*)$/gm, '<ul class="markdown"><li>$1</li></ul>');

        // Convert lines
        mdString = mdString.replace(new RegExp("\n", "g"), '<br>');
 
        // Convert paragraphs
        mdString = mdString.split('\n').map(p => `<span class="markdown">${p}</span>`).join('');
        return mdString;
    }
</script>

<div class="content">
    {@html MarkdownToHtml(tos)}
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
        margin-top: 4em;
    }
</style>