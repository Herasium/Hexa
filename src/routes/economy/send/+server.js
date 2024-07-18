import { get_profile, getUserFromName, send_blockcoin, isvalidloggin } from "$lib/server/firebase"
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
      throw redirect(303, "/login?next=" + encodeURI("/economy"))
    }

    const { username, amount } = await request.json();
    let to = Object.values(await getUserFromName(username))[0].id;
    console.log(to)
    const success = await send_blockcoin(user, to, Math.abs(amount))
    if (success[0] != true) {
      if (success[1] == 1) {
        return json({url: "/economy" + '?error=04.1.042'}, {status: 200});
      } else if (success[1] == 2) {
        return json({url: "/economy" + '?error=04.1.031'}, {status: 200});
      } else if (success[1] == 3) {
        return json({url: "/economy" + '?error=04.1.045'}, {status: 200});
      }
    } else {
      return json({url: "/economy"}, {status: 200});
    }
  } else {
    if (check_valid.code != 200 || check_valid.data != user || check_valid.sub != "t") {
      throw redirect(303, "/login?next=" + encodeURI("/economy"))
    }
  }
}