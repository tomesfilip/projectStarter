
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
    const projectType = projectInput.value.toString()
    let dest = path.join(os.homedir(), projectName)
    const isWin = os.platform() === 'win32' ? true : false
    // commands
    const cdCommand = isWin ? 'cd/' : 'cd'
    const codeCommand = 'code .'
    const npmInitCommand = 'npm init -y'

    // getting the destination path for the main folder
    if(outputPath != undefined){
        dest = path.join(outputPath, projectName)
    }

    const getToDirCommand = `cd ${dest}`

    // creating the main folder
    try {
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest)
        }
    } catch (err) {
        console.log(err)
    }


    // basic npm init
    exec(`${cdCommand} && ${getToDirCommand} && ${npmInitCommand}`, (err, stdout, stderr) => {
        if (err){
            console.log(err.message)
        }
        if (stderr){
            console.log(stderr)
            return
        }
        console.log(stdout)
    })

    // project types
    if (projectType === 'base-web'){

        // folder structure
        const publicFolder = path.join(dest, '/public')
        const srcFolder = path.join(dest, '/src')
        const imgFolder = path.join(dest, '/src/img')
        const sassFolder = path.join(dest, '/src/sass')
        const jsFolder = path.join(dest, '/src/js')
        const outCssFolder = path.join(dest, '/public/css')

        const folders = [publicFolder, srcFolder, imgFolder, sassFolder, jsFolder, outCssFolder]
        
        // creating folder structure
        for (i = 0; i < folders.length; i++) {
            if(!fs.existsSync(folders[i])){
                fs.mkdirSync(folders[i], {}, err => {
                    if (err) throw err
                })
            }   
        }
    }

    exec(`${cdCommand} && ${getToDirCommand} && ${codeCommand}`, (err, stdout, stderr) => {
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