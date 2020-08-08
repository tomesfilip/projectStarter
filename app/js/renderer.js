
require('dotenv/config')

const path = require('path')
const os = require('os')
const fs = require('fs')
const { exec } = require('child_process')

// const { ipcRenderer, shell } = require('electron')
const { dialog } = require('electron').remote
const { Octokit } = require('@octokit/rest')
const { stdout } = require('process')

let outputPath = ""
const outputPathBtn = document.querySelector('#path-btn')
const form = document.querySelector('#project-form')
const gitRepo = document.querySelector('#repo')
const nameInput = document.querySelector('#name')
const projectInput = document.querySelector('#project')
const infoTab = document.querySelector('#info-tab')
const infoText = document.querySelector('#info-text')

const octokit = new Octokit({
    auth: process.env.TOKEN,
})

// functions for showing and hiding info tab
const showTab = (tab) => {
    tab.classList.remove('hidden')
}

const hideInfoTab = () => {
    if (!infoTab.classList.contains('hidden')) {
        infoTab.classList.add('hidden')
    }
}

// set output path for project
outputPathBtn.addEventListener('click', (e) => {
    e.preventDefault()

    outputPath = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })

    if (outputPath != undefined) {
        outputPath = outputPath.toString()
    }     
    
    outputPathBtn.value = outputPath
    
})

// on submit
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const projectName = nameInput.value.toString()
    const isRepo = gitRepo.checked
    const projectType = projectInput.value.toString()
    let dest = os.homedir()
    const isWin = os.platform() === 'win32' ? true : false
    // commands
    const cdCommand = isWin ? 'cd/' : 'cd'
    const codeCommand = 'code .'
    const npmInitCommand = 'npm init -y'

    // getting the destination path for the main folder
    if (outputPath != undefined) {
        dest = outputPath
    }

    const projectPath = path.join(dest, projectName)
    const getToDirCommand = `cd ${dest}`

    // folder structure
    const publicFolder = path.join(projectPath, '/public')
    const srcFolder = path.join(projectPath, '/src')
    const imgFolder = path.join(projectPath, '/src/img')
    const sassFolder = path.join(projectPath, '/src/sass')
    const jsFolder = path.join(projectPath, '/src/js')
    const outCssFolder = path.join(projectPath, '/public/css')
    const assestFolder = path.join(projectPath, '/assets')

    // create github repo
    function createRepository() {
        octokit.repos.createForAuthenticatedUser({
            name: projectName,
            auto_init: true,
        })
    }

    // get github repo
    function getRepository() {
        const getRepoCommand = `git clone https://github.com/${process.env.USERNAME}/${projectName}.git`
        
        exec(`${cdCommand} &&  ${getToDirCommand} && ${getRepoCommand}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err.message)
            }
            if (stderr) {
                console.log(stderr)
                return
            }
            console.log(stdout)
        })
    }

    function openVSCode() {
        exec(`${cdCommand} && ${getToDirCommand} && cd ${projectName} && ${codeCommand}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err.message)
            }
            if (stderr) {
                console.log(stderr)
                return
            }
            console.log(stdout)
        })
    }

    // basic npm init
    function npmInit() {
        exec(`${cdCommand} && ${getToDirCommand} && cd ${projectName} && ${npmInitCommand}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err.message)
            }
            if (stderr) {
                console.log(stderr)
                return
            }
            console.log(stdout)
        })
    }

    // function for creating folders
    function makeFolders(folders) {
        if (folders.length < 1) {
            console.log('cannot create folder structure with no folders')
        } 
        for (i = 0; i < folders.length; i++) {
            if (!fs.existsSync(folders[i])) {
                fs.mkdirSync(folders[i], {}, err => {
                    if (err) throw err
                })
            }  
        }
    }

    // function for creating folder structure inside main project folder
    function makeFolderStructure() {
        // project types
        if (projectType === 'base-web') {
            const folders = [publicFolder, srcFolder, imgFolder, sassFolder, jsFolder, outCssFolder]
            makeFolders(folders)            
        }
        else if (projectType === 'laravel-web') {
            const createLarProjectCommand = `laravel new ${projectName}`

            exec(`${cdCommand} && ${getToDirCommand} && cd ${projectName} && ${createLarProjectCommand}`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err.message)
                }
                if (stderr) {
                    console.log(stderr)
                    return
                }
                console.log(stdout)
            })
        }
        else if (projectType === 'flutter-app') {
            // copied from base web type
            const folders = [publicFolder, srcFolder, imgFolder, sassFolder, jsFolder, outCssFolder]
            makeFolders(folders)
        }
        else if (projectType === 'electron-app') {
            const iconsFolder = path.join(projectPath, '/assets/icons')
            const folders = [srcFolder, assestFolder, iconsFolder]
            makeFolders(folders)
        }
    }

    function createAll() {
        try {
            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(projectPath)
            }
        } catch (err) {
            console.log(err)
        }
        showTab(infoTab)
        infoText.innerHTML = `creating ${projectType} in ${projectPath}`
        setTimeout(hideInfoTab, 4000)
        npmInit()
        makeFolderStructure()
        openVSCode()
    }

    function createAllRepo() {
        showTab(infoTab)
        infoText.innerHTML = `creating git repository of ${projectType} in ${projectPath}`
        setTimeout(hideInfoTab, 4000)
        createRepository()
        setTimeout(getRepository, 1800)
        setTimeout(npmInit, 1900)
        setTimeout(makeFolderStructure, 1900)
        setTimeout(openVSCode, 2000)
    }

    isRepo ? createAllRepo() : createAll()
})