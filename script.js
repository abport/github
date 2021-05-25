const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)
        createUserCard(data)
        getRepos(username)
    } catch (err) {
        if(err.response.status == 404) {
            createErrorCard('No profile with this username!')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch (err) {
        createErrorCard('Problem fetching repos!')
    }
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <a href="${user.html_url}" target="_blank" class="user-github-link"><span title="Visit ${user.name}'s Github Profile">(${user.login})</span></a>
            <p id="userBio">${user.bio}</p>
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
            <div class="vcard-details" id="vcard">
            <ul>
                <li id="vcardCompany" class="vcard-detail" itemprop="worksFor" show_title="false" aria-label="Organization: ${user.company}">
                    <span class="iconify" data-icon="dashicons:building" data-inline="false"></span>
                    <a id="userMention" class="user-mention" data-hovercard-type="organization" href="${user.company}">${user.company}</a>
                    <span id="companyName" class="p-org">${user.company}</span>
                </li>
                <li id="vcardLocation" class="vcard-detail" itemprop="homeLocation" show_title="false" aria-label="Home location: ${user.location}">
                    <span class="iconify" data-icon="dashicons:location-alt" data-inline="false"></span>
                    <span class="p-label">${user.location}</span>
                </li>
                <li id="vcardEmail" itemprop="email" aria-label="Email: ${user.email}" class="vcard-detail">
                    <span class="iconify" data-icon="dashicons:email-alt" data-inline="false"></span>
                    <a class="u-email" href="mailto:${user.email}">${user.email}</a>
                </li>
                <li id="vcardBlog" itemprop="url" data-test-selector="profile-website-url" class="vcard-detail">
                    <span class="iconify" data-icon="dashicons:admin-links" data-inline="false"></span>
                    <a rel="nofollow me" class="Link--primary" href="http://${user.blog}" target="_blank">${user.blog}</a>
                </li>
                <li id="vcardTwitter" itemprop="twitter" data-test-selector="profile-twitter-url" class="vcard-detail">
                    <span class="iconify" data-icon="dashicons:twitter" data-inline="false"></span>
                    <a rel="nofollow me" class="Link--primary " href="https://twitter.com/${user.twitter_username}">@${user.twitter_username}</a>
                </li>
            </ul>
            </div>

            <div id="repos"></div>
        </div>
    </div>
    `

    main.innerHTML = cardHTML
    const userBio = document.getElementById('userBio')
    const vcard = document.getElementById('vcard')
    const vcardCompany = document.getElementById('vcardCompany')
    const userMention = document.getElementById('userMention')
    const companyName = document.getElementById('companyName')
    const vcardLocation = document.getElementById('vcardLocation')
    const vcardEmail = document.getElementById('vcardEmail')
    const vcardBlog = document.getElementById('vcardBlog')
    const vcardTwitter = document.getElementById('vcardTwitter')

    if (!user.bio) userBio.classList.add('display-none')

    if(!user.company && !user.location && !user.email && !user.blog && !user.twitter_username) {
        vcard.classList.add('display-none')
    }
    if (!user.company) {
        vcardCompany.classList.add('display-none')
    } else if (user.company.startsWith("@")) {
        userMention.href = `https://github.com/${user.company.slice(1)}`
        companyName.classList.add('display-none')
    } else { userMention.classList.add('display-none') }
    if (!user.location) vcardLocation.classList.add('display-none')
    if (!user.email) vcardEmail.classList.add('display-none')
    if (!user.blog) vcardBlog.classList.add('display-none')
    if (!user.twitter_username) vcardTwitter.classList.add('display-none')
    
}

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEle = document.getElementById('repos')

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEle = document.createElement('a')
            repoEle.classList.add('repos')
            repoEle.href = repo.html_url
            repoEle.target = '_blank'
            repoEle.innerText = repo.name

            reposEle.appendChild(repoEle)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})
