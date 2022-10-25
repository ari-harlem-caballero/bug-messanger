import {
    checkAuth,
    logout,
    getProfile,
    incrementKarma,
    decrementKarma,
    sendMessage,
    getUser,
} from '../fetch-utils.js';
import { renderMessagesEl } from './render-profile-utils.js';

const params = new URLSearchParams(window.location.search);

const id = params.get('id');

checkAuth();

const form = document.querySelector('form');
const usernameEl = document.querySelector('.username');
const usernameHeaderEl = document.querySelector('.username-header');
const logoutButton = document.getElementById('logout');
const profileDetailEl = document.querySelector('.profile-detail');

logoutButton.addEventListener('click', () => {
    logout();
});


window.addEventListener('load', async() => {
    fetchAndDisplayProfile();
});

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    const data = new FormData(form);
    const fromUser = await getUser();

    await sendMessage({
        text: data.get('message'),
        from_email: fromUser.email,
        recipient_id: id
    });

    form.reset();
    await fetchAndDisplayProfile();
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfile(id);

    usernameHeaderEl.textContent = profile.email;
    usernameEl.textContent = profile.email;

    const profileKarmaEl = renderKarmaEl(profile);    
    const messagesEl = renderMessagesEl(profile);

    profileDetailEl.append(messagesEl, profileKarmaEl);
}

function renderKarmaEl(profile) {
    const p = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');

    const profileKarmaEl = document.createElement('div');
    
    profileKarmaEl.classList.add('profile-karma');
    profileKarmaEl.append(p, upButton, downButton);

    downButton.textContent = 'downvote user ⬇️';
    upButton.textContent = 'upvote user ⬆️';
    p.classList.add('profile-name');
    p.textContent = `${profile.email} has ${profile.karma} ✈️`;

    downButton.addEventListener('click', async() => {
        await decrementKarma(profile.id);

        await fetchAndDisplayProfile();
    });

    upButton.addEventListener('click', async() => {
        await incrementKarma(profile.id);

        await fetchAndDisplayProfile();
    });

    return profileKarmaEl;
}

