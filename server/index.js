const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const patientsRoutes = require('./routes/patients');
const covid19Routes = require('./routes/covid19');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/patients', patientsRoutes);
app.use('/covid19', covid19Routes);

app.get('/', (req, res) => {
    res.status(200).json({
        result: 'Hello user!'
    });
});

app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
});
