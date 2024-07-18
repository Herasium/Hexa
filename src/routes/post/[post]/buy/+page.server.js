import { get_post, convert_post } from "$lib/server/firebase"
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
    let post = await get_post(params.post);
	if (post != null) {
        return {post: await convert_post(post)};
    } else {
        error(404, {
            message: 'Post not found.'
        });
    }
}