import { get_profile, get_liked_comment, isvalidloggin } from "$lib/server/firebase"
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
      return json({liked: false}, {status: 200});
    }

    const { refrence } = await request.json();
    let liked = await get_liked_comment(user, refrence);
    return json({liked}, {status: 200});
  } else {
    return json({liked: false}, {status: 200});
  }
}