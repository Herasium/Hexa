import { error, redirect } from '@sveltejs/kit';
import { v5 as uuid} from 'uuid'
import { get_profile, create_comment, create_reply } from '$lib/server/firebase.js';

export const actions = {
    async default({ request, cookies }) {
        const form = await request.formData();
        let logged = cookies.get("_ci") != undefined && cookies.get("_ci") != null && cookies.get("_ci") != ""
        const user = cookies.get("_ci")

        if (await get_profile(user) == null) {logged = false}

        if (logged) {
            console.log(form.get("replier"))
            if (form.get("replying") == "false") {
                await create_comment(user,form.get("comment"),form.get("replier"));
                throw redirect(303, "/post/" + form.get("replier"));
            } else {
                await create_reply(user,form.get("comment"),form.get("replier"));
                throw redirect(303, "/post/" + form.get("replier").split("/")[2]);
            }
        }
    }
};
