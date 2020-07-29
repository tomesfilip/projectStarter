const os = require('os')

const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit({
    auth: ""
})

let outputPath = document.querySelector('#path')
const outputPathBtn = document.querySelector('#path-btn')
const form = document.querySelector('#project-form')
const gitRepo = document.querySelector('#repo')
const nameInput = document.querySelector('#name')
const projectInput = document.querySelector('#project')


require("dotenv").config()

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

const userWithAuth = new octokit({
    auth: process.env.TOKEN
})

// on submit
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const projectName = nameInput.value
    const isRepo = gitRepo.checked
    const projectType = projectInput.value
    console.log(outputPath, projectName, isRepo, projectType)
    userWithAuth.repos.createForAuthenticatedUser({
        name: "testing"
    })
})