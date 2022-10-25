import { checkAuth, logout, getProfiles } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

const profileListEl = document.querySelector('.profile-list');

window.addEventListener('load', async() => {
    const profiles = await getProfiles();

    for (let profile of profiles) {
        const div = document.createElement('div');
        const pKarma = document.createElement('p');
        const aEmail = document.createElement('a');

        div.classList.add('profile-list-item');
        aEmail.classList.add('profile-link');
        pKarma.classList.add('small-karma');

        pKarma.textContent = `✈️${profile.karma}`;
        aEmail.textContent = `${profile.email}`;
        aEmail.href = `../profile/?id=${profile.id}`;

        div.append(aEmail, pKarma);

        profileListEl.append(div);
    }
});