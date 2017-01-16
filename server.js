var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var app = express();


app.use(morgan('combined')); // Active le middleware de logging

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');
app.listen(1313);


// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// On affiche le formulaire d'enregistrement

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function (req, res) {
    // TODO vérifier si l'utilisateur existe
	
});

app.get('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
	res.render('register');
});
/* On affiche le profile  */
app.get('/profile', function (req, res) {
    // TODO  
    // On redirige vers la login si l'utilisateur n'a pas été authentifier 
    // Afficher le button logout
	res.redirect('/login')
});


// Base de donnée --> Connection Simple
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pictionnary'
});

connection.connect();

connection.query('SELECT * FROM users', function (err, rows, fields) {
    if (!err)
        logger.info('Le résultat de la requête: ', rows);
    else
        logger.error(err);
});

connection.end();

/*
// Pool (ensemble d'instance disponible pour que le serveur puisse se connecter)
var pool =  mysql.createPool({
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'root',
    password: '',
    database: 'pictionnary'
  });   

  pool.getConnection(function(err,connection,res){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Erreur de connexion à la DB"});
          return;
        }  

        logger.info('connecté en tant que ' + connection.threadId);

        connection.query("SELECT * FROM users",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erreur de connexion à la DB"});
              return;    
        });
  });*/
