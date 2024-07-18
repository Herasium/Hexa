export async function POST({request, cookies}) {
    const { theme } = await request.json();
    cookies.set("v2-theme",theme,{
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
    });
}