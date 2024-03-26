const express = require('express')
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({
      result: 'Hello user!'
    });
  });

app.listen(port, () => {
    console.log('App is listen at port:', port);
  });