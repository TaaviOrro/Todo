const express = require('express');
const fs = require('node:fs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const tasksFile = './tasks.json';


const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
               console.error(err);
               return;
              }
              const tasks = JSON.parse(data)
              resolve(tasks)
        });
    });
};

const writeFile = (filename, data) => {
    return new  Promise((resolve, reject)=> {
        fs.writeFile(filename, data, 'utf8', err => {
            if(err) {
                console.error(err);
                return;
            }
            resolve(true)
        })
    })
}

app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    console.log('post')
    let error = null
    if (req.body.task.trim().length==0) {
        error = 'please insert correct task data'
        readFile('/tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    } else {
        readFile('./tasks.json')
        .then(tasks => {
            let index
            if(tasks.length ===0)
            {
                index = 0
            } else {
                index = tasks[tasks.length-1].id + 1;
            }
            const newTask = {
                "id" : index,
                "task" : req.body.task
            }
            tasks.push(newTask)
            data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
            })
    }
    
})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks=> {
        tasks.forEach((task, index)=> {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            }
        })
        data = JSON.stringify(tasks, null , 2)
        writeFile ('tasks.json', data)
        res.redirect('/')
        })
    })

app.get('/', (req, res)=> {
    readFile ('./tasks.json')
    .then(tasks => {
        console.log(tasks)
        res.render('index', {
            tasks: tasks,
            error: null
        })
    })
})


app.listen(3001, () => {
    console.log('Server started at http://localhost:3001');
});
