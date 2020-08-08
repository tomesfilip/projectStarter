const settingsTab = document.querySelector('#settings-tab')
const formTab = document.querySelector('#form-tab')
const settingsBtn = document.querySelector('#settings-btn')
const settingsForm = document.querySelector('#form-settings')
const goBackBtn = document.querySelector('#go-back-btn')

function toggleHidden(firstTab, secondTab) {
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
    toggleHidden(formTab, settingsTab)
})

goBackBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const gitName = document.querySelector('#git-name').value
    const gitToken = document.querySelector('#git-token').value

    const data = `USERNAME = ${gitName.toString()}\nTOKEN = ${gitToken.toString()}`

    fs.writeFile('.env', data, (err) => {
        if (err) throw err
    })    

    toggleHidden(formTab, settingsTab)
    showTab(infoTab)
    if (gitName.length > 1 && gitToken.length > 10) {
        infoText.innerHTML = `git name and git token were successfully saved.`
    }
    else {
        infoText.innerHTML = 'git name or git token is too short'
    }
    setTimeout(hideInfoTab, 3000)
    
})





