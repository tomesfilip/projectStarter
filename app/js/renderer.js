const os = require('os')

const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote

let outputPath = document.querySelector('#path')
const outputPathBtn = document.querySelector('#path-btn')
const form = document.querySelector('#project-form')


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