<script>
    export let user;
</script>

<a href="/profile/{user}">@{user}</a>

<style>
    a {
        text-decoration: none;
        border-radius: 10px;
        padding: 5px;
        background: rgba(48, 50, 143,0.3);
        color: white;
        transition-duration: 0.25s;
    }

    a:hover {
        background: rgba(48, 50, 143,0.5);
    }
</style>