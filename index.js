const express = require('express');
const fs = require('node:fs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const tasksFile = './tasks';


const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        
        fs.access(filename, fs.constants.F_OK, (err) => {
            if (err) {
               
                fs.writeFile(filename, '', (err) => {
                    if (err) {
                        console.error("Error creating tasks file:", err);
                        return reject(err);
                    }
                    resolve([]);
                });
            } else {
            
                fs.readFile(filename, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return reject(err); 
                    }
                    const tasks = data.split("\n").filter(task => task.trim() !== ''); // Remove empty tasks
                    resolve(tasks); 
                });
            }
        });
    });
};

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    readFile(tasksFile)
        .then(tasks => {
            console.log(tasks);
            res.render('index', { tasks: tasks });
        })
        .catch(err => {
            console.error("Error reading tasks file:", err);
            res.status(500).send('Error reading tasks');
        });
});


app.post('/', (req, res) => {
    readFile(tasksFile)
        .then(tasks => {
            
            tasks.push(req.body.task.trim()); 
            const data = tasks.join("\n"); 
            fs.writeFile(tasksFile, data, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error saving task');
                }
                res.redirect('/'); 
            });
        })
        .catch(err => {
            console.error("Error reading tasks file:", err);
            res.status(500).send('Error reading tasks');
        });
});


fs.access(tasksFile, fs.constants.F_OK, (err) => {
    if (err) {
        
        fs.writeFile(tasksFile, '', (err) => {
            if (err) {
                console.error("Error creating tasks file:", err);
            } else {
                console.log("Tasks file created.");
            }
        });
    }
});


app.listen(3001, () => {
    console.log('Server started at http://localhost:3001');
});
