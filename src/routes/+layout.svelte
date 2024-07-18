<script>
    import Background from '$lib/elements/background.svelte';
    import Navbar from '$lib/elements/navbar.svelte';
    import CreatePost from "$lib/elements/create_post.svelte";
    import Head from '$lib/elements/head.svelte';
    import '$lib/style/vars.css'
    import { page } from '$app/stores'
    import { onMount } from 'svelte';
    export let data
    const profile = data.profile
    const logged = data.logged
    const nav = {profile:profile,logged:logged}

    function parseTheme(theme) {
        let type = theme.meta["type"] || "theme"
        if (type == "theme") {
            // Background
            let background = theme.data["background"] || {};
            document.body.style.setProperty("--background-data",background["color"] || "black");
            document.body.style.setProperty("--background-elipse-1-color",(background["elipse-color"] || ["#B803FF", "#0771FF"])[0] || (background["color"] || "black"));
            document.body.style.setProperty("--background-elipse-2-color",(background["elipse-color"] || ["#B803FF", "#0771FF"])[1] || (background["color"] || "black"));
            document.body.style.setProperty("--background-elipse-display",background["elipse-display"] || "block");
            document.body.style.setProperty("--background-blur",background["blur"] || "200px");
    
            // Text
            let text = theme.data["text"] || {};
            document.body.style.setProperty("--text-font",text["font"] || "Poppins");
            let fontlink = document.createElement("link");
            fontlink.href = `https://fonts.googleapis.com/css2?family=${text["font-code"] || "Poppins"}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;
            fontlink.rel = "stylesheet";
            document.head.append(fontlink)
            document.body.style.setProperty("--text-color",text["color"] || "white");
            if (theme.meta["key"] && theme.meta["key"] == "bc-theme-v2") {
                let sizes = text["size"] || ["1vw", "1.5vw", "2vw", "2.5vw", "3vw", "4vw", "6vw"];
                document.body.style.setProperty("--text-size-1",sizes[0] || "1vw");
                document.body.style.setProperty("--text-size-2",sizes[1] || "1.5vw");
                document.body.style.setProperty("--text-size-3",sizes[2] || "2vw");
                document.body.style.setProperty("--text-size-3-5",sizes[3] || "2.5vw");
                document.body.style.setProperty("--text-size-4",sizes[4] || "3vw");
                document.body.style.setProperty("--text-size-5",sizes[5] || "4vw");
                document.body.style.setProperty("--text-size-6",sizes[6] || "6vw");
            } else {
                let sizes = text["size"] || ["1vw", "1.5vw", "2vw", "3vw", "4vw", "6vw"];
                document.body.style.setProperty("--text-size-1",sizes[0] || "1vw");
                document.body.style.setProperty("--text-size-2",sizes[1] || "1.5vw");
                document.body.style.setProperty("--text-size-3",sizes[2] || "2vw");
                document.body.style.setProperty("--text-size-4",sizes[3] || "3vw");
                document.body.style.setProperty("--text-size-5",sizes[4] || "4vw");
                document.body.style.setProperty("--text-size-6",sizes[5] || "6vw");
            }
            document.body.style.setProperty("--text-weight-normal",text["font-weight"] || "400");
            document.body.style.setProperty("--text-weight-thin",text["font-weight-light"] || "300");
            document.body.style.setProperty("--text-weight-bold",text["font-weight-bold"] || "700");
            document.body.style.setProperty("--text-weight-black",text["font-weight-black"] || "900");
            document.body.style.setProperty("--text-link-cursor",text["link-cursor"] || "pointer");
            document.body.style.setProperty("--text-link-decoration",text["link-decoration"] || "none");
    
            // Badge
            let badge = theme.data["badge"] || {};
            document.body.style.setProperty("--badge-color",badge["color"] || "white");
            document.body.style.setProperty("--badge-radius",badge["border-radius"] || "none");
            document.body.style.setProperty("--badge-border",badge["border"] || "none");
            document.body.style.setProperty("--badge-background",badge["background"] || "none");
    
            // Post
            let post = theme.data["post"] || {};
            document.body.style.setProperty("--post-border",post["border"] || "solid white 1px");
            document.body.style.setProperty("--post-radius",post["border-radius"] || "16px");
            document.body.style.setProperty("--post-background",post["background"] || "black");
    
            // Comment
            let comment = theme.data["comment"] || {};
            document.body.style.setProperty("--comment-border",comment["border"] || "solid white 1px");
            document.body.style.setProperty("--comment-radius",comment["border-radius"] || "16px");
            document.body.style.setProperty("--comment-background",comment["background"] || "black");
    
            // Navbar
            let navbar = theme.data["navbar"] || {};
            document.body.style.setProperty("--navbar-background",navbar["background"] || "none");
            document.body.style.setProperty("--navbar-blur",navbar["blur"] || "10px");
            document.body.style.setProperty("--navbar-border",navbar["border"] || "none");
            document.body.style.setProperty("--navbar-border-radius",navbar["border-radius"] || "none");

            // Global
            let global = theme.data["global"] || {};
            let radiuses = global["border-radius"] || ["16px", "32px", "64px"];
            document.body.style.setProperty("--global-border-radius-1",radiuses[0] || "16px");
            document.body.style.setProperty("--global-border-radius-2",radiuses[1] || "32px");
            document.body.style.setProperty("--global-border-radius-3",radiuses[2] || "64px");
            document.body.style.setProperty("--global-border",global["border"] || "solid white 1px");
            document.body.style.setProperty("--picture-size",global["picture-size"] || "48px");

            // New
            let New = theme.data["new"] || {};
            document.body.style.setProperty("--new-background",New["background"] || "white");
            document.body.style.setProperty("--new-color",New["color"] || "black");
            document.body.style.setProperty("--new-border",New["border"] || "none");

            // Logo
            let logo = theme.data["logo"] || {};
            document.body.style.setProperty("--logo-url",'url("' + (logo["url"] || "https://blockcoin.social/logo.png") + '")');
        } else if (type == "css") {
            let css = "";
            for (const [name,properties] of Object.entries(theme.data)) {
                let type = properties["type"];
                delete properties["type"];

                let selector = (type == "tag" ? "" : (type == "class" ? "." : (type == "id" ? "#" : ""))) + name;
                let rule = selector + " {\n";
                for (const [property,value] of Object.entries(properties)) {
                    rule += "\t" + property + ": " + value + " !important;\n";
                }
                rule += "}\n\n";
                css += rule;
            }
            let style = document.createElement("style");
            style.innerHTML = css;
            document.head.append(style)
        }
    }

</script>

{#if $page.url.pathname != '/trending/post' && $page.url.pathname != '/explore/post' && $page.url.pathname != '/feed/post'}
    <Head />
    <Background />

    <Navbar {nav} />
    <!--<<div id="ver">Hexa! Alpha v0.0.1, built on Blockcoin v3.1.2</div>>-->
{/if}

<slot />

<style>
    #ver {
        position: fixed;
        bottom: 0;
        right: 0;
        font-family: var(--text-font);
        font-weight: var(--text-weight-normal);
        font-size: var(--text-size-1);
        color: var(--text-color);
    }
    #new_button {
        z-index:1000;
        width: 94px;
        height: 94px;
        border-radius:256px;
        background-color:var(--new-background);
        position:fixed;
        bottom:25px;
        right:25px;
        color: var(--new-color);
        text-align: center;
        vertical-align: middle;
        line-height: 94px;
        cursor:pointer;
        font-size: 72px;
        border:var(--new-border);
        transition-duration: 500ms;
    }
    #new_button:hover {
        width: 100px;
        height: 100px;
        font-size: 78px;
        line-height: 100px;
    }
</style>

