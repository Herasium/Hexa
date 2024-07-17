import { error, redirect } from '@sveltejs/kit';
import { v5 as uuid} from 'uuid'
import { get_profile, create_post } from '$lib/server/firebase.js';

export const actions = {
    async default({ request, cookies }) {
        const form = await request.formData();
        let logged = cookies.get("_ci") != undefined && cookies.get("_ci") != null && cookies.get("_ci") != ""
        const user = cookies.get("_ci")

        if (await get_profile(user) == null) {logged = false}

        if (logged) {
            let id = await create_post(user,form.get("post"),(!Number.isNaN(parseInt(form.get("price").trim())) ? Math.abs(parseInt(form.get("price").trim())) : 0),form.get("price").trim() != "");
            throw redirect(303, "/post/" + id);
        }
    }
};
