<script>
	import { Carta, MarkdownEditor } from "carta-md";
	import { attachment } from "@cartamd/plugin-attachment";
	import { emoji } from "@cartamd/plugin-emoji";
	import { code } from "@cartamd/plugin-code";
	import DOMPurify from 'isomorphic-dompurify';

	import "$lib/style/github.scss";
	const placeholder_list = [
		"Why do I exist ?",
		"Hexa! on top!",
		"This is just a placeholder, you can remove it.",
		"It was fun.",
		"Lol",
		"Create your own post !",
		'Why even bother? You have a life.',
		"What is the purpose of my life?",
		"Hmm. What placeholder should this be? Eh just a placeholder for the placeholder.",
		"Found a bug, report it. We will be glad, tho you wont get paid or anything.",
		`You got this placeholder, it's a 1/15 chance!`,
		"🎉 Hexa! is open source, we will be glad if you would like to contribute.",
		"You are npt legally obligated to subscribe to Hexa! Premium, because it doesn't exist.",
		"I have no more ideas",
		"See you in 2027 for new update",
		"You can show some love to blockcoin too!"
	]

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: [
			attachment({
				upload(file) {
					return new Promise((resolve) => {
       					const reader = new FileReader();

        				reader.onload = () => {
            				const fileContentBase64 = reader.result.split(',')[1];
							fetch("/post/upload_img",{
                				method: "POST",
                				body: JSON.stringify({
									image: fileContentBase64
                				}),
			    				headers: {
				    				'Content-Type': 'application/json'
			    				}
            				}).then(async response => {
                				return await response.json();
            				}).then(data => {
            					resolve(data.data);
            				})
        				};

       					 reader.readAsDataURL(file);
    				});
				},
			}),
			emoji(),
			code(),
		],
		theme:"min-dark",
	});

	export let price = null

	export let value = placeholder_list[Math.floor(Math.random()*placeholder_list.length)];

	function check_length () {if (value.length > 500) {value = value.substring(0, 500)}}

	$: value,check_length()
</script>

<div class="bg">
	<MarkdownEditor bind:value mode="tabs" theme="github" {carta} />
	<div class="under">
		<div class="counter">{value.length}/500</div>
		<form method="post" action="/post">
			<textarea name="post" value={value} readonly style="display:none"></textarea>
			<input name="price" value={price} readonly style="display:none"  max=1000 min=0/>
			<button class="post" type="submit">Post!</button>
		</form>
	</div>
</div>

<style>

	input{
        background: none;
        text-align: center;
        color: var(--text-color);
        border: none !important;
		stroke: none !important;
		appearance: none;
		outline: none;
        font-size: var(--text-size-1);
        width: 561px;
		background-color: #0d1117 !important;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 64px;
		margin: 1%;
		height: 3%;
    }

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.under {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		width: 561px;
	}
	.post {
        cursor: pointer;
        margin-top: 10px;
        color: var(--text-color);
        font-size: var(--text-size-1);
        font-weight: var(--text-weight-normal);
        border: 1px white solid;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 32px;
        width: 200px;
        height: 53px;
      }
	.bg {
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		position: fixed;
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(30px);
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	* {
		font-family: var(--text-font);
		color: white; /* General text color */
		border:none;
	}




</style>
