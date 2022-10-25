const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQxMTMxMiwiZXhwIjoxOTUxOTg3MzEyfQ.PHekiwfLxT73qQsLklp0QFEfNx9NlmkssJFDnlvNIcA';

const SUPABASE_URL = 'https://gxwgjhfyrlwiqakdeamc.supabase.co';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export async function sendMessage(message) {
    const response = await client
        .from('messages')
        .insert(message);

    return checkError(response);
}

export async function getMessages() {
    const response = await client
        .from('messages')
        .select();

    return checkError(response);
}

export async function getProfiles() {
    const response = await client
        .from('profiles')
        .select();

    return checkError(response);
}

export async function createProfile(email) {
    const response = await client
        .from('profiles')
        .insert({ email });

    return checkError(response);
}

export async function getProfile(id) {
    const response = await client
        .from('profiles')
        .select('*, messages (*)')
        .match({ id })
        .single();

    return checkError(response);
}

export async function incrementKarma(id) {
    const profile = await getProfile(id);

    const response = await client
        .from('profiles')
        .update({ karma: profile.karma + 1 })
        .match({ id })
        .select();

    return checkError(response);
}

export async function decrementKarma(id) {
    const profile = await getProfile(id);

    const response = await client
        .from('profiles')
        .update({ karma: profile.karma - 1 })
        .match({ id })
        .select();

    return checkError(response);
}

export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./profiles');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    await createProfile(email);

    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
