
require('dotenv/config')

const path = require('path')
const os = require('os')
const fs = require('fs')
const { exec } = require('child_process')

// const { ipcRenderer, shell } = require('electron')
const { dialog } = require('electron').remote
const { Octokit } = require('@octokit/rest')

let outputPath = document.querySelector('#path')
const outputPathBtn = document.querySelector('#path-btn')
const form = document.querySelector('#project-form')
const gitRepo = document.querySelector('#repo')
const nameInput = document.querySelector('#name')
const projectInput = document.querySelector('#project')

const octokit = new Octokit({
    auth: process.env.TOKEN,
})

// set output path for project
outputPathBtn.addEventListener('click', (e) => {
    e.preventDefault()

    outputPath = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })

    if(outputPath != undefined){
        outputPath = outputPath.toString()
    }        
})



// on submit
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const projectName = nameInput.value.toString()
    const isRepo = gitRepo.checked
    const projectType = projectInput.value
    let dest = path.join(os.homedir(), projectName)

    if(outputPath != undefined){
        dest = path.join(outputPath, projectName)
    }

    fs.mkdirSync(dest, {}, err => {
        if(err) throw err
    })

    const isWin = os.platform() === 'win32' ? true : false
    const cdCommand = isWin ? 'cd/' : 'cd'
    const CodeCommand = `cd ${dest} && code .`


    exec(`${cdCommand} && ${CodeCommand}`, (err, stdout, stderr) => {
        if (err){
            console.log(err.message)
        }
        if (stderr){
            console.log(stderr)
            return
        }
        console.log(stdout)
    })
    

    if(isRepo){
        octokit.repos.createForAuthenticatedUser({
            name: projectName,
            auto_init: true,
        })
    }    
})