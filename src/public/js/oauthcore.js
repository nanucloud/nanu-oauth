const CLIENT_ID = '756287078934-bor6radanusjdhn8uo610ua0aaag3f3g.apps.googleusercontent.com';
const REDIRECT_URI = 'https://id.nanu.cc/oauth_ca';

document.getElementById('loginButton').addEventListener('click', () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `response_type=token` +
        `&client_id=${encodeURIComponent(CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=profile email` +
        `&include_granted_scopes=true` +
        `&state=state_parameter_passthrough_value`;

    window.location.href = authUrl;
});