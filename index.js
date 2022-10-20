//import frameworks, and npm
const express = require('express'); 
const cors = require('cors'); //fix CORS error to allow incomming request from any source (cor addes "Access-Control ... header")
const monk = require('monk'); //adds the data base by adding mongodb

//"activates" express with this application
const app = express();

const db = monk('localhost/infoshare');  //create connection to data base
const mess = db.get('mess'); //create collection in the data base

app.use(cors());
app.use(express.json()); //add ability to parse incoming data as JSON

//gives an initial response to the the client (in console) with a message when the website loads
app.get('/', (req, res) => {
    res.json({
        message: 'Working'
    });
});

//getting data from the database and respond back to the server
app.get('/infos', (req, res) =>{
    mess
        .find() //grab all the messages
        .then(mess =>{
            res.json(mess);  //respond back the messages
        })
});

//function makes sure that the user does not submit empty forms to the database
function isValidinfo(info) {
    return info.name && info.name.toString().trim() !== '' &&
        info.content && info.content.toString().trim() !== '';
}

app.post('/infos', (req, res) => {
    if (isValidinfo(req.body)) {
        const info = {                     //create object "info" with name, content, and date
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        mess
            .insert(info)    //insert into collection in db ...
            .then(createdinfo => {
                res.json(createdinfo);  //respond back to client with the new info
            })
        console.log(info);
    } else {       //respond back to client with error code and message if info entered isn't valid
        res.status(422);
        res.json({
            message: 'You need to enter something. CONTRIBUTE!!!! 🤑🤑🤑'
        });
    }
});

//start the backend server
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
