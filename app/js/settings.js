const settingsTab = document.querySelector('#settings-tab')
const formTab = document.querySelector('#form-tab')
const settingsBtn = document.querySelector('#settings-btn')
const settingsForm = document.querySelector('#form-settings')
const goBackBtn = document.querySelector('#go-back-btn')
const askTab = document.querySelector('#ask-tab')
const yesBtn = document.querySelector('#yes-btn')
const cancelBtn = document.querySelector('#cancel-btn')

// toggle hidden class to the chosen elements
const toggleHidden = (firstTab, secondTab) => {
    if (!firstTab.classList.contains('hidden')) {
        firstTab.classList.add('hidden')
        secondTab.classList.remove('hidden')
    }
    else {
        secondTab.classList.add('hidden')
        firstTab.classList.remove('hidden')
    }
}

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const envExists = fs.existsSync('.env')
    hideTab(formTab)
    envExists ? showTab(askTab) : showTab(settingsTab)
})

// button events
yesBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleHidden(askTab, settingsTab)
})

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleHidden(askTab, formTab)
})

// create .env file
const createEnv = (data) => {
    fs.writeFile('.env', data, (err) => {
        if (err) throw err
    })    
}
// check length of github name and token, returns boolean
const checkLength = (gitName, gitToken) => {
    if (gitName.length > 1 && gitToken.length > 10) {
        return true
    }
    else {
        return false
    } 
}

goBackBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const gitName = document.querySelector('#git-name').value
    const gitToken = document.querySelector('#git-token').value
    const data = `USERNAME = ${gitName.toString()}\nTOKEN = ${gitToken.toString()}`
    createEnv(data)
    toggleHidden(formTab, settingsTab)
    showTab(infoTab)
    checkLength(gitName, gitToken) ? infoText.innerHTML = `git name and git token were successfully saved.` :  infoText.innerHTML = 'git name or git token is too short'
    setTimeout(hideInfoTab, 3000)    
})
