const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();
const port = 3000;

const patientsRoutes = require('./routes/patients');

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/patients', patientsRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        result: 'Hello user!'
    });
});

app.listen(port, () => {
    console.log('App is listening at port:', port);
});
