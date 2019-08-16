const express = require('express'),
      app     = express(),
      morgan  = require('morgan'),
      PORT    =  process.env.PORT ||3000 ;

//Settings

//Middlewares
app.use(express.json());
app.use(morgan('dev'));

//Rutes
 app.use('/', require('./rutes/login'));
 app.use('/hoteles', require('./rutes/hoteles'));
 app.use('/operadores', require('./rutes/operadoresTuristicos'));
 app.use('/sitios', require('./rutes/sitiosTuristicos'));




//Starting server
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})