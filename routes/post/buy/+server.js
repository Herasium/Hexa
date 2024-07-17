import { get_profile, buy_post, isvalidloggin } from "$lib/server/firebase"
import { check_token } from "$lib/server/token"
import { json, redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  let logged = cookies.get("_ci") != undefined && cookies.get("_ci") != null && cookies.get("_ci") != ""
  const user = cookies.get("_ci")
  if (await get_profile(user) == null) { logged = false }
  const check_valid = await check_token(cookies.get("_st"))

  if (logged) {
    if (check_valid.code != 200 || check_valid.data != user || check_valid.sub != "t") {
      throw redirect(303, "/login?next=" + encodeURI(request.url))
    }

    const { post } = await request.json();
    buy_post(user, post).then(success => {
      if (success[0] != true) {
        if (success[1] == 1) {
          return json({url: "/post/" + post + "/buy" + '?error=04.1.042'}, {status: 200});
        } else if (success[1] == 2) {
          return json({url: "/post/" + post + "/buy" + '?error=04.1.043'}, {status: 200});
        } else if (success[1] == 3) {
          return json({url: "/post/" + post + "/buy" + '?error=04.1.044'}, {status: 200});
        }
      } else {
        return json({url: "/post/" + post}, {status: 200});
      }
    })
  } else {
    if (check_valid.code != 200 || check_valid.data != user || check_valid.sub != "t") {
      throw redirect(303, "/login?next=" + encodeURI(request.url))
    }
  }
}
