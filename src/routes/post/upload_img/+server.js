import { send_img } from "$lib/server/firebase"
import { json, redirect } from '@sveltejs/kit';

export async function POST({request}) {
    const { image } = await request.json();
    const img = await send_img(image);
    return json({ data: img["data"]["url"] }, { status: 200 });
}