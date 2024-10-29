const express = require('express')

const app = express()
const path=require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=> {
    const tasks = ['Study JS', 'Study templating', 'Study HTTP'] 
    res.render('index', {tasks: tasks})
})

app.listen(3001, ()=> {
    console.log('Server started at http://localhost:3001')
})