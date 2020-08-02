const settingsTab = document.querySelector('#settings-tab')
const formTab = document.querySelector('#form-tab')
const settingsBtn = document.querySelector('#settings-btn')
const settingsForm = document.querySelector('#form-settings')
const goBackBtn = document.querySelector('#go-back-btn')

function toggleHidden() {
    if (!formTab.classList.contains('hidden')) {
        formTab.classList.add('hidden')
        settingsTab.classList.remove('hidden')
    }
    else {
        settingsTab.classList.add('hidden')
        formTab.classList.remove('hidden')
    }
}

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleHidden()
})

goBackBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const gitName = document.querySelector('#git-name').value
    const gitToken = document.querySelector('#git-token').value

    const data = `USERNAME = ${gitName.toString()}\nTOKEN = ${gitToken.toString()}`

    fs.writeFile('.env', data, (err) => {
        if (err) throw err
        console.log('file has been saved')
    })    

    toggleHidden()
})





