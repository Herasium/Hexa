// @ts-nocheck
import admin from 'firebase-admin';
import { v5 } from 'uuid'
import serviceAccount from "./creds/firebase.json";
import { createHash } from 'crypto';
import { UAParser } from "ua-parser-js"
import { send_ip_email } from './email';
import { generate_token, check_token } from './token';
import NodeCache from "node-cache";


export function detectLanguage(text) {
  const langCode = franc(text);
  return langCode
}

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

let CURRENT = "local"

function removeUndefinedValues(obj) {
  for (let key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeUndefinedValues(obj[key]);
    }
  }
}


export function checkUsername(inputString) {
  const pat = /^[a-zA-Z0-9\.\-_]{4,16}$/;
  const match = inputString.match(pat);
  return match !== null;
}

export function checkPassword(inputString) {
  const pat = /^.{8,32}$/;
  const match = inputString.match(pat);
  return match !== null;
}

export function checkEmail(s) {
  const pat = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
  const match = s.trim().match(pat);
  return match !== null;
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

if (process.env.SERVICE != undefined) {
  CURRENT = "prod"
}

const post_income = [
  0.1, // View
  1,  // Like
  3,  // Follow
]


const trending_cache = new NodeCache({ stdTTL: 600 });
const user_posts_cache = new NodeCache({ stdTTL: 600 });
const user_buyed_cache = new NodeCache({ stdTTL: 600 });

try {
  if (CURRENT == "local") {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://hexadb-6710c-default-rtdb.firebaseio.com/"
    });
  } else if (CURRENT == "prod") {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.SERVICE)),
      databaseURL: "https://hexadb-6710c-default-rtdb.firebaseio.com/"
    });
  }
} catch (e) {
  console.log("Firebase app already exist (hot reload)")
}




const db = admin.database();

const writeToDatabase = (collection, data) => {
  const ref = db.ref(collection);
  return ref.set(data);
};

export const readFromDatabase = (collection) => {
  const ref = db.ref(collection);
  return ref.once('value').then(snapshot => snapshot.val());
};

export async function send_img(img) {
  const url = 'https://api.imgbb.com/1/upload';
  const fd = new FormData();
  fd.append('image', img);

  const response = await fetch(url + '?' + "key=" + "1823345679a03537df30e5aa0771b109", {
    method: 'POST',
    body: fd
  });
  return await response.json();
}


export async function get_profile(user) {
  let profile = await db.ref("/Users/" + user).once("value", function (snapshot) { return snapshot });
  profile = profile.val()

  return profile
}

export function transform_profile(profile) {
  const newprofile = {
    "display": profile["display"],
    "user": profile["user"],
    "id": profile["id"],
    "about": profile["about"],
    "profile-picture": profile["profile-picture"],
    "banner": profile["banner"],
    "badges": profile["badges"] || [],
    "balance": profile["balance"],
    "followers": profile["followers"],
    "profile_picture":profile["profile-picture"],
  }
  return newprofile
}
async function convert_comment(comment) {
  let profile;

  profile = await db.ref("/Users/" + comment["user"]).once("value", function (snapshot) { return snapshot });
  profile = profile.val()

  if (profile == null) {
    profile = {
      "display": "Deleted User",
      "user": "404",
      "id": "404",
      "profile-picture": "https://i.ibb.co/qD79cdF/image.png",
      "badges": [],

    }
  }

  const profile_data = {
    "display": profile["display"],
    "user": profile["user"],
    "id": comment["user"],
    "profile-picture": profile["profile-picture"],
    "badges": profile["badges"] || []
  };

  for (let i = 0; i < (comment.replies || []).length; i++) {
    comment.replies[i] = await convert_comment(comment.replies[i]);
  }

  const comment_data = {
    "data": comment,
    "profile": profile_data
  };

  let regex = />/i;
  comment_data["data"]["data"] = comment_data["data"]["data"].replace(regex, '&gt;')

  regex = /</i;
  comment_data["data"]["data"] = comment_data["data"]["data"].replace(regex, '&lt;')

  delete comment_data["data"]["all_likes"]
  return comment_data
}

async function get_comment_amount(comment) {
  let comments = (comment["data"].replies || []).length;
  for (const reply of (comment["data"].replies || [])) {
    comments = comments + await get_comment_amount(reply);
  }
  return comments;
}

export async function convert_post(post) {
  let profile, buyer;


  profile = await db.ref("/Users/" + post["user"]).once("value", function (snapshot) { return snapshot });
  profile = profile.val()

  if (post["buyer"] !== "None") {
    buyer = await db.ref("/Users/" + post["buyer"]).once("value", function (snapshot) { return snapshot });
    buyer = buyer.val()
  }

  if (profile == null) {
    profile = {
      "display": "Deleted User",
      "user": "404",
      "id": "404",
      "profile-picture": "https://i.ibb.co/qD79cdF/image.png",
      "badges": [],

    }
  }

  const profile_data = {
    "display": profile["display"],
    "user": profile["user"],
    "id": post["user"],
    "profile-picture": profile["profile-picture"],
    "badges": profile["badges"] || []
  };

  for (let i = 0; i < (post.comments || []).length; i++) {
    post.comments[i] = await convert_comment(post.comments[i]);
  }

  const post_data = {
    "data": post,
    "profile": profile_data
  };

  if (buyer) {
    const buyer_data = {
      "display": buyer["display"],
      "user": buyer["user"],
      "id": post["buyer"],
      "profile-picture": buyer["profile-picture"],
      "badges": buyer["badges"] || []
    };
    post_data["buyer"] = buyer_data;
  }

  let regex = />/i;
  post_data["data"]["data"] = post_data["data"]["data"].replace(regex, '&gt;')

  regex = /</i;
  post_data["data"]["data"] = post_data["data"]["data"].replace(regex, '&lt;')

  post_data["data"]["comments_number"] = post_data["data"]["comments"] ? post_data["data"]["comments"].length : 0
  for (const comment of (post_data["data"]["comments"] || [])) {
    post_data["data"]["comments_number"] = post_data["data"]["comments_number"] + await get_comment_amount(comment);
  }
  delete post_data["data"]["all_likes"]
  delete post_data["data"]["view_list"]
  return post_data
}

export async function convert_transaction_history(history) {
  for (let i = 0; i < history.length; i++) {
    if (history[i].type == "from") {
      let profile = await db.ref("/Users/" + history[i].user).once("value", function (snapshot) { return snapshot });
      profile = profile.val()
      history[i].username = profile.user;
      history[i]["profile-picture"] = profile["profile-picture"];
    } else if (history[i].type == "to") {
      let profile = await db.ref("/Users/" + history[i].user).once("value", function (snapshot) { return snapshot });
      profile = profile.val()
      history[i].username = profile.user;
      history[i]["profile-picture"] = profile["profile-picture"];
    }
  }

  return history;
}

export async function trending(offset) {
  try {
    offset = parseInt(offset)
    if (offset in trending_cache) {
      const trending_posts = trending_cache[offset];
      const sorted_trending = trending_posts.sort((a, b) => b["data"]["score"] - a["data"]["score"]);
      return sorted_trending;
    }

    let posts = await db.ref('/Posts').orderByChild('date').startAfter(Date.now() / 1000 + 604800).once("value", function (snapshot) { return snapshot });
    posts = posts.val()
    let trending_posts = [];
    const profiles = {};

    for (const [key, value] of Object.entries(posts)) {
      const date_score = (Date.now() / 1000 - value["date"]) / (60 * 60 * 24);
      const likes_score = (value["likes"] + 1) / (value["views"] + 1);
      const view_score = value["views"];
      const score = ((view_score / 100) * likes_score * 1000) / (date_score + 1);
      value["score"] = score;
      posts[key] = value;
    }

    const sorted_dict = Object.fromEntries(Object.entries(posts).sort(([, a], [, b]) => b["score"] - a["score"]));
    const sliced = Object.fromEntries(
      Object.entries(sorted_dict).slice(20 * offset, 20 * (offset + 1))
    );
    let count = offset * 20
    for (const [key, value] of Object.entries(sliced)) {
      let new_post = await convert_post(value)
      new_post["data"]["position"] = count
      trending_posts.push(new_post)
      count++
    }

    trending_cache[offset] = trending_posts;
    return trending_posts
  } catch (error) {
    console.error("Error in trending function:", error);
  }
};

async function getPostsFromUser(user) {
  let posts = await db.ref('/Posts').orderByChild('user').equalTo(user).once("value", function (snapshot) { return snapshot });
  posts = posts.val()
  return posts

}

async function getTotalLikesFromComment(user,comment) {
  if (comment.user == user) {
    let likes = comment.likes;
    for (const reply of (comment.replies || [])) {
      likes = likes + await getTotalLikesFromComment(user,reply);
    }
    return likes;
  } else {
    return 0;
  }
}

export async function getStats(user) {
  let posts = await db.ref("/Posts/").once("value", function (snapshot) { return snapshot });
  posts = posts.val();
  let likes = 0;
  let views = 0;
  let postid;
  for (postid in posts) {
    let post = posts[postid];
    if (post.user == user) {
      likes += post.likes;
      views += post.likes;
    }
    for (const comment of (post.comments || [])) {
      likes += await getTotalLikesFromComment(user,comment)
    }
  }
  return { likes, views }
}

export async function getUserFromName(name) {
  let user = await db.ref('/Users').orderByChild('user').equalTo(name).once("value", function (snapshot) { return snapshot });
  return user.val()
}
async function getUserFromEmail(name) {
  let user = await db.ref('/Users').orderByChild('email').equalTo(name).once("value", function(snapshot) {return snapshot});
  return user.val()
}


export async function login_user(username, password, ip, agent) {

  const user = username.toLowerCase()

  const id = v5("https://blockcoin.social/" + user.toLowerCase(), v5.URL)

  const profile = await get_profile(id)

  if (profile == null) { return { id: null, http: 409, internal: "02.4.031" } }

  if (hash(password + user) != profile.password) { return { id: null, http: 403, internal: "02.4.002" } }

  if (profile.ip.includes(ip)) return { id: id, http: 200 }

  const ip_data = await (await fetch("http://ip-api.com/json/" + ip + "?fields=66846719")).json()

  const continent = (ip_data.status == "success") ? ip_data.continent : "UNKNOWN"
  const country = (ip_data.status == "success") ? ip_data.country : "UNKNOWN"
  const city = (ip_data.status == "success") ? ip_data.city : "UNKNOWN"

  const parser = new UAParser(agent)
  const os = parser.getDevice().vendor + " " + parser.getOS().name + " " + parser.getOS().version
  const location = continent + " • " + country + " • " + city

  send_ip_email(id, username, profile.email, location, os, await generate_token({ id: id, ip: ip }, "aip", 300))

  return { id: null, http: 403, internal: "02.4.035" }
}

export async function create_user(username, email, password, ip, agent) {

  const user = username.toLowerCase()
  const id = v5("https://blockcoin.social/" + user, v5.URL)

  if (await getUserFromName(user) != null) { return { id: null, http: 409, internal: "02.4.032" } }

  if (checkEmail(email) == false) { return { id: null, http: 409, internal: "02.4.023" } }
  if (checkUsername(user) == false) { return { id: null, http: 409, internal: "02.4.023" } }
  if (checkPassword(password) == false) { return { id: null, http: 409, internal: "02.4.023" } }

  const ip_data = await (await fetch("http://ip-api.com/json/" + ip + "?fields=66846719")).json()
  const parser = new UAParser(agent)
  let parser_result = parser.getResult()
  removeUndefinedValues(parser_result)

  const user_profil = {
    'email': email,
    'about': 'Hello! I\'m ' + username + '! And I have a BlockCoin Account!',
    'password': hash(password + user),
    'balance': 0,
    'banned': false,
    'banner': "https://blockcoin.social/assets/default_banner.png",
    'user': user,
    'followers': 0,
    'public-balance': true,
    'public-follow': true,
    'display': username,
    'profile-picture': "https://blockcoin.social/assets/acc_" + (getRandomInt(4) + 1) + ".svg",
    "join-date": Date.now(),
    'ip': [ip],
    'id': id,
    'verified': false,
    "badges": [5],
    "ip_data": [{
      "local": ip_data.status == "fail",
      "country": (ip_data.status == "success") ? ip_data.countryCode : "UNKNOWN",
      "continent": (ip_data.status == "success") ? ip_data.continentCode : "UNKNOWN",
      "region": (ip_data.status == "success") ? ip_data.region : "UNKNOWN",
      "city": (ip_data.status == "success") ? ip_data.city : "UNKNOWN",
      "zip": (ip_data.status == "success") ? ip_data.zip : "UNKNOWN",
      "timezone": (ip_data.status == "success") ? ip_data.timezone : "UNKNOWN",
      "currency": (ip_data.status == "success") ? ip_data.currency : "UNKNOWN",
      "proxy": (ip_data.status == "success") ? ip_data.proxy : "UNKNOWN",
      "isp": (ip_data.status == "success") ? ip_data.isp : "UNKNOWN",
    }],
    "main_ip": 0,
    "ua_data": [parser_result],
  }

  await db.ref("/Users/" + id).set(user_profil)

  return { id: id, http: 200 }

}

export async function change_user_value(user, type, value) {
  let user_data = await get_profile(user)
  if (type == "profile-picture" || type == "banner") {
    const img = await send_img(value);
    user_data[type] = img["data"]["url"];
    await db.ref("/Users/" + user).set(user_data)
    return img["data"]["url"];
  } else if (type == "password") {
    user_data[type] = hash(value + user_data["user"]);
    await db.ref("/Users/" + user).set(user_data)
    return value;
  } else if (type == "display") {
    user_data[type] = value.substring(0, 20);
    await db.ref("/Users/" + user).set(user_data)
    return value;
  } else if (type == "about") {
    user_data[type] = value.substring(0, 100);
    await db.ref("/Users/" + user).set(user_data)
    return value;
  } else if (type == "email") {
    user_data[type] = value;
    await db.ref("/Users/" + user).set(user_data)
    return value;
  }
}

export function toid(user) {
  return v5("https://blockcoin.social/"+user,v5.URL)
}

export async function userexist(user) {
  return await getUserFromName(user.toLowerCase()) !== null
}

export async function emailexist(email) {
  return await getUserFromEmail(email) !== null
}


export async function verifyemail(user) {
  const userId = toid(user)
  await db.ref(`/Users/${userId}/verified`).set(true)
}

export async function isvalidloggin(user, token) {
  const data = await check_token(token)
  return (data.type == "t" || data.data == user.toLowerCase())
}

export async function explore(offset) {
  try {
    offset = parseInt(offset)

    let posts = await db.ref('/Posts').orderByChild('date').once("value", function (snapshot) { return snapshot });
    posts = posts.val()
    let trending_posts = [];
    const profiles = {};
    for (const [key, value] of Object.entries(posts)) {
      const score = Math.random()
      value["score"] = score
    }

    const sorted_dict = Object.fromEntries(Object.entries(posts).sort(([, a], [, b]) => b["score"] - a["score"]));
    const sliced = Object.fromEntries(
      Object.entries(sorted_dict).slice(20 * offset, 20 * (offset + 1))
    );
    let count = offset * 20
    for (const [key, value] of Object.entries(sliced)) {
      let new_post = await convert_post(value)
      new_post["data"]["position"] = count
      trending_posts.push(new_post)
      count++
    }
    return trending_posts
  } catch (error) {
    console.error("Error in explore function:", error);
  }
};

export async function get_post(id) {
  let post = await db.ref("/Posts/" + id).once("value", function (snapshot) { return snapshot });
  post = post.val()

  return post
}

export async function create_post(user, post, price, buyable) {
  const time = Date.now() / 1000

  const res = await fetch('https://vector.profanity.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: post }),
  })

  let id = crypto.randomUUID();

  const post_data = {
    "data": post,
    "user": user,
    "date": time,
    "likes": 0,
    "like_list": [],
    "all_likes": [],
    "views": 0,
    "view_list": [],
    "buyer": "None",
    "price": price,
    "isBuyable": buyable,
    "ver": 2,
    "boost_multi": 1,
    "boost_end": 0,
    "hashtags": "",
    "profanity": (await res.json()).isProfanity,
    "id": id,
    "device": "Hexa! Browser App",
  }

  await db.ref("/Posts/" + id).set(post_data);
  return id;
}

export async function create_comment(user, comment, post) {
  const time = Date.now() / 1000

  const res = await fetch('https://vector.profanity.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: comment }),
  })

  let comments = await db.ref("/Posts/" + post + "/comments/").once("value", function (snapshot) { return snapshot });
  comments = comments.val() || [];
  console.log(comments,"/Posts/" + post + "/comments/")

  const comment_data = {
    "data": comment,
    "user": user,
    "date": time,
    "likes": 0,
    "like_list": [],
    "all_likes": [],
    "id": comments.length
  }
  comments.push(comment_data)

  if (!(await res.json()).isProfanity) {
    await db.ref("/Posts/" + post + "/comments/").set(comments);
  }
}

export async function create_reply(user, comment, refrence) {
  const time = Date.now() / 1000

  const res = await fetch('https://vector.profanity.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: comment }),
  })

  let comments = await db.ref(refrence + "/replies/").once("value", function (snapshot) { return snapshot });
  comments = comments.val() || [];

  const comment_data = {
    "data": comment,
    "user": user,
    "date": time,
    "likes": 0,
    "like_list": [],
    "all_likes": [],
    "id": comments.length
  }
  comments.push(comment_data)

  if (!(await res.json()).isProfanity) {
    await db.ref(refrence + "/replies/").set(comments);
  }
}


export async function buy_post(user,postid) {
  let post = await db.ref("/Posts/" + postid).once("value", function (snapshot) { return snapshot });
  post = post.val();
  let profile = await db.ref("/Users/" + user).once("value", function (snapshot) { return snapshot });
  profile = profile.val();
  let owner = (post.buyer != "None" ? await db.ref("/Users/" + post.buyer).once("value", function (snapshot) { return snapshot }) : await db.ref("/Users/" + post.user).once("value", function (snapshot) { return snapshot }))
  owner = owner.val();
  if (profile.balance >= post.price && post.isBuyable == true && owner.id != user) {
    profile.balance = profile.balance - post.price;
    owner.balance = owner.balance + post.price;
    profile["transaction-history"] = profile["transaction-history"] || [];
    profile["transaction-history"].push({
      "type": "to",
      "user": owner.id,
      "amount": post.price
    })
    owner["transaction-history"] = owner["transaction-history"] || [];
    owner["transaction-history"].push({
      "type": "from",
      "user": user,
      "amount": post.price
    })
    await db.ref("/Users/" + user).set(profile);
    await db.ref("/Users/" + owner).set(owner);
    await db.ref("/Posts/" + postid + "/buyer").set(user);
    return [true,0];
  } else {
    return [false,(profile.balance < post.price ? 1 : (post.isBuyable == false ? 2 : (owner.id == user ? 3 : 0)))];
  }
}

export async function view_post(user,postid) {
  let post = await db.ref("/Posts/" + postid).once("value", function (snapshot) { return snapshot });
  post = post.val();
  let owner = (post.buyer != "None" ? await db.ref("/Users/" + post.buyer).once("value", function (snapshot) { return snapshot }) : await db.ref("/Users/" + post.user).once("value", function (snapshot) { return snapshot }))
  owner = owner.val();
  if (!(post.view_list || []).includes(user)) { 
    post.view_list = (post.view_list || []);
    post.view_list.push(user);
    post.views = post.views + 1;
    owner.balance = owner.balance + post_income[0];
    owner["transaction-history"] = owner["transaction-history"] || [];
    owner["transaction-history"].push({
      "type": "post",
      "amount": post_income[0]
    })
    await db.ref("/Users/" + owner.id).set(owner);
    await db.ref("/Posts/" + postid).set(post);
  }
}

export async function like_post(user,postid) {
  let post = await db.ref("/Posts/" + postid).once("value", function (snapshot) { return snapshot });
  post = post.val();
  let owner = (post.buyer != "None" ? await db.ref("/Users/" + post.buyer).once("value", function (snapshot) { return snapshot }) : await db.ref("/Users/" + post.user).once("value", function (snapshot) { return snapshot }))
  owner = owner.val();
  if (!(post.like_list || []).includes(user)) {
    post.like_list = (post.like_list || []);
    post.like_list.push(user);
    post.likes = post.likes + 1;
    if (!(post.all_likes || []).includes(user)) {
      post.all_likes = (post.all_likes || []);
      post.all_likes.push(user);
      owner.balance = owner.balance + post_income[1];
      owner["transaction-history"] = owner["transaction-history"] || [];
      owner["transaction-history"].push({
        "type": "post",
        "amount": post_income[1]
      })
      await db.ref("/Users/" + owner.id).set(owner);
    }
    await db.ref("/Posts/" + postid).set(post);
  } else {
    post.like_list.splice((post.like_list || []).indexOf(user), 1);
    post.likes = post.likes - 1;
    await db.ref("/Posts/" + postid).set(post);
  }
}

export async function like_comment(user,refrence) {
  let comment = await db.ref(refrence).once("value", function (snapshot) { return snapshot });
  comment = comment.val();
  let owner = await db.ref("/Users/" + comment.user).once("value", function (snapshot) { return snapshot })
  owner = owner.val();
  if (!(comment.like_list || []).includes(user)) {
    comment.like_list = (comment.like_list || []);
    comment.like_list.push(user);
    comment.likes = comment.likes + 1;
    if (!(comment.all_likes || []).includes(user)) {
      comment.all_likes = (comment.all_likes || []);
      comment.all_likes.push(user);
      owner.balance = owner.balance + post_income[1];
      owner["transaction-history"] = owner["transaction-history"] || [];
      owner["transaction-history"].push({
        "type": "comment",
        "amount": post_income[1]
      })
      await db.ref("/Users/" + owner.id).set(owner);
    }
    await db.ref(refrence).set(comment);
  } else {
    comment.like_list.splice((comment.like_list || []).indexOf(user), 1);
    comment.likes = comment.likes - 1;
    await db.ref(refrence).set(comment);
  }
}

export async function get_liked_post(user,postid) {
  let post = await db.ref("/Posts/" + postid).once("value", function (snapshot) { return snapshot });
  post = post.val();
  return (post.like_list || []).includes(user);
}

export async function get_liked_comment(user,refrence) {
  let comment = await db.ref(refrence).once("value", function (snapshot) { return snapshot });
  comment = comment.val();
  return (comment.like_list || []).includes(user);
}

export function check_date(year, month, day) {
  const date = new Date(year, month - 1, day);
  return (
      date.getFullYear() == year &&
      date.getMonth() + 1 == month &&
      date.getDate() == day
  );
}

export async function user_posts(user,offset) {
  try {
    offset = parseInt(offset)
    if (user in user_posts_cache) {
      if (offset in user_posts_cache) {
        const trending_posts = user_posts_cache[user][offset];
        const sorted_trending = trending_posts.sort((a, b) => b["data"]["likes"] - a["data"]["likes"]);
        return sorted_trending;
      }
    }
    let posts = await db.ref('/Posts').orderByChild('user').equalTo(user).once("value", function (snapshot) { return snapshot });
    posts = posts.val()
    let trending_posts = [];

    const sorted_dict = Object.fromEntries(Object.entries(posts).sort(([, a], [, b]) => b["likes"] - a["likes"]));
    const sliced = Object.fromEntries(
      Object.entries(sorted_dict).slice(20 * offset, 20 * (offset + 1))
    );
    let count = offset * 20
    for (const [key, value] of Object.entries(sliced)) {
      let new_post = await convert_post(value)
      new_post["data"]["position"] = count
      trending_posts.push(new_post)
      count++
    }
    if (user in user_posts_cache == false) {
          user_posts_cache[user] = {}
    }

    user_posts_cache[user][offset] = trending_posts;
    return trending_posts
  } catch (error) {
    console.error("Error in user post function:", error,user);
  }
};

export async function user_buyed_posts(user,offset) {
  try {
    offset = parseInt(offset)
    if (user in user_buyed_cache) {
      if (offset in user_buyed_cache) {
        const trending_posts = user_buyed_cache[user][offset];
        const sorted_trending = trending_posts.sort((a, b) => b["data"]["likes"] - a["data"]["likes"]);
        return sorted_trending;
      }
    }
    let posts = await db.ref('/Posts').orderByChild('buyer').equalTo(user).once("value", function (snapshot) { return snapshot });
    posts = posts.val()
    let trending_posts = [];

    const sorted_dict = Object.fromEntries(Object.entries(posts).sort(([, a], [, b]) => b["likes"] - a["likes"]));
    const sliced = Object.fromEntries(
      Object.entries(sorted_dict).slice(20 * offset, 20 * (offset + 1))
    );
    let count = offset * 20
    for (const [key, value] of Object.entries(sliced)) {
      let new_post = await convert_post(value)
      new_post["data"]["position"] = count
      trending_posts.push(new_post)
      count++
    }
    if (user in user_buyed_cache == false) {
      user_buyed_cache[user] = {}
    }

    user_buyed_cache[user][offset] = trending_posts;
    return trending_posts
  } catch (error) {
    console.error("Error in user post function:", error,user);
  }
};

export async function follow_user(user,tofollow) {
  let follow_data = await db.ref('/Users/'+tofollow+"/followers_list").once("value", function (snapshot) { return snapshot });
  follow_data = follow_data.val()

  let following_data = await db.ref('/Users/'+user+"/following_list").once("value", function (snapshot) { return snapshot });
  following_data = following_data.val()

  if (follow_data == null ){follow_data = []}
  if (following_data == null ){following_data = []}

  if (follow_data.includes(user)) {
    const index = follow_data.indexOf(user);
    if (index > -1) { 
      follow_data.splice(index, 1); 
    }
  } else {
    follow_data.push(user)
  }

  if (following_data.includes(tofollow)) {
    const index = following_data.indexOf(tofollow);
    if (index > -1) { 
      following_data.splice(index, 1); 
    }
  } else {
    following_data.push(tofollow)
  }

  await db.ref('/Users/'+user+"/following_list").set(following_data)
  await db.ref('/Users/'+tofollow+"/followers_list").set(follow_data)
  await db.ref('/Users/'+tofollow+"/followers").set(follow_data.length)
}


export async function get_if_user_follow(user,tofollow) {
  let following_data = await db.ref('/Users/'+user+"/following_list").once("value", function (snapshot) { return snapshot });
  following_data = following_data.val()
  if (following_data) {
    return following_data.includes(tofollow)
  }
  return false
}

export async function send_blockcoin(user, to, amount) {
  let sender = await db.ref("/Users/" + user).once("value", function (snapshot) { return snapshot });
  sender = sender.val()
  let reciever = await db.ref("/Users/" + to).once("value", function (snapshot) { return snapshot });
  reciever = reciever.val()
 
  if (sender.balance >= amount && reciever != null && user != to) {
    sender.balance = sender.balance - amount;
    sender["transaction-history"] = sender["transaction-history"] || [];
    sender["transaction-history"].push({
      "type": "to",
      "user": to,
      "amount": amount
    })
    await db.ref("/Users/" + user).set(sender);
    reciever = await db.ref("/Users/" + to).once("value", function (snapshot) { return snapshot });
    reciever = reciever.val()
    reciever.balance = reciever.balance + amount;
    reciever["transaction-history"] = reciever["transaction-history"] || [];
    reciever["transaction-history"].push({
      "type": "from",
      "user": user,
      "amount": amount
    })
    await db.ref("/Users/" + to).set(reciever);
    return [true,0];
  } else {
    return [false,(sender.balance < amount ? 1 : (reciever == null ? 2 : (user == to ? 3 : 0)))];
  }
}
