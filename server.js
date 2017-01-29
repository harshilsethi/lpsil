var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();


app.use(morgan('combined')); // Active le middleware de logging
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');
app.listen(1313);


// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Base de donnée --> Connection Simple
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pictionnary'
});

connection.connect();

connection.query('SELECT * FROM users', function (err, rows) {
    if (!err)
        logger.info('Le résultat de la requête: ', rows);
    else
        logger.error(err);
});


// On affiche le formulaire d'enregistrement

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function (req, res) {
    // TODO vérifier si l'utilisateur existe
    var username = req.body.username;
    var password = req.body.password;
    if (username != "" && password != "" && username != "admin@admin.fr")
    {
        login(username, password, res);
    }
    else
    {
        if (username == "admin@admin.fr" && password != "")
        {
            admin(username, password, res);
        }
        else
        {
            res.redirect('/login');
        }
    }

});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
    var email = req.body.email;
    var password = req.body.password;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var tel = req.body.tel;
    var website = req.body.website;
    var sexe = req.body.sexe;
    var birthdate = req.body.birthdate;
    var ville = req.body.ville;
    var taille = req.body.taille;
    var couleur = req.body.couleur.substring(1,req.body.couleur.length);
    var profilepic = req.body.profilepic;
    var personne = {
        email:email,
        password:password,
        nom:nom,
        prenom:prenom,
        tel:tel,
        website:website,
        sexe:sexe,
        birthdate:birthdate,
        ville:ville,
        taille:taille,
        couleur:couleur,
        profilepic:profilepic
    };
    register(personne, res);
});

app.get('/logout',function(req, res){
    session.valid = false;
    res.redirect("/login");
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
    // TODO  
    // On redirige vers le login si l'utilisateur n'a pas été authentifier
    // Afficher le button logout
    if(session.open = true)
    {
        res.render('profile', {
            email: session.email,
            nom: session.nom,
            prenom: session.prenom,
            profilepic: session.profilepic
    });
	//res.redirect('/login');
    }
});

app.get('/editProfile', function (req, res) {
    // TODO
    // On redirige vers le login si l'utilisateur n'a pas été authentifier
    // Afficher le button logout
    if(session.open = true)
    {
        res.render('editProfile', {
            email: session.email,
            nom: session.nom,
            prenom: session.prenom,
            profilepic: session.profilepic
        });
        res.redirect('/login');
    }
});

app.post('/editProfile', function (req, res) {
    // TODO modifier un profile utilisateur
    var email = req.body.email;
    var password = req.body.password;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var tel = req.body.tel;
    var website = req.body.website;
    var ville = req.body.ville;
    var taille = req.body.taille;
    var couleur = req.body.couleur.substring(1,req.body.couleur.length);
    var profilepic = req.body.profilepic;
    var personne = {
        email:email,
        password:password,
        nom:nom,
        prenom:prenom,
        tel:tel,
        website:website,
        ville:ville,
        taille:taille,
        couleur:couleur,
        profilepic:profilepic
    };
    updateUser(personne, res);
});

app.get('/deleteAccount', function(req, res) {
    if(session.email == null)
    {
        res.redirect('/login');
    }
   deleteAccount();
});

app.get('/paint', function (req, res) {
    res.render('paint', {
        couleur: session.couleur
    });
});

/*
app.get('/paint', function(req, res) {
    if(session.open = true) {
        connection.query("  SELECT *" +
            "               FROM drawings",
            function (err, rows) {
                if (!err) {
                    logger.info('La liste des paintures: ', rows);
                    res.render('paint', {
                        email: session.email,
                        prenom: session.prenom,
                        profilepic: session.profilepic,
                        couleur: session.couleur,
                        painting: rows
                    })
                }
            });
    }
});
*/
/*
app.post('/paint', function(req, res) {
    var commands = req.body.commands;
    var picture = req.body.picture;
    var id = session.id;
    var design = {
        commands: commands,
        picture: picture,
        id: id
    };
    paint(design)
});
*/
app.get('/admin', function (req, res) {
    if(session.open = true) {
        connection.query("  SELECT prenom " +
            "               FROM users",
            function (err, rows) {
                if (!err) {
                    logger.info('La liste des utilisateurs: ', rows);
                    res.render('admin', {
                        email: session.email,
                        prenom: session.prenom,
                        profilepic: session.profilepic,
                        users: rows
                    })
                }
        });
    }
});
/*
app.get('/setUsers', function (req, res) {
    if(session.open = true)
    {
        var users = "";
        connection.query("  SELECT * " +
            "               FROM users",
            function (err, rows) {
                if (!err) {
                    users = rows;
                    for(var i = 0 ; i < users.length ; i++) {
                        logger.info('prenom: ', users[i].prenom);
                        res.render('editProfile', {
                            email: session.email,
                            nom: users[i].nom,
                            prenom: users[i].prenom,
                            profilepic: session.profilepic
                        });
                    }
                }
            });
    }
});

app.post('/setUsers', function (req, res) {
    // TODO modifier un profile utilisateur
    var email = req.body.email;
    var password = req.body.password;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var tel = req.body.tel;
    var website = req.body.website;
    var ville = req.body.ville;
    var taille = req.body.taille;
    var couleur = req.body.couleur.substring(1,req.body.couleur.length);
    var profilepic = req.body.profilepic;
    var personne = {
        email:email,
        password:password,
        nom:nom,
        prenom:prenom,
        tel:tel,
        website:website,
        ville:ville,
        taille:taille,
        couleur:couleur,
        profilepic:profilepic
    };
    var users = "";
    connection.query("  SELECT prenom " +
        "               FROM users",
        function (err, rows) {
            users = rows;
            for(var i = 0 ; i < users.length ; i++) {
                logger.info('prenom: ', users[i].prenom);
                setUsers(personne, users[i].prenom, res);
            }
        });

});
*/
/*
app.get('/getUsers', function (req, res) {
    if(session.email == null)
    {
        res.redirect('/login');
    }
   getUsers();
});
*/

function register(personne, res) {
    connection.query("  INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) " +
        "               VALUES ('" + personne.email + "', '" + personne.password + "', '" + personne.nom + "', '" + personne.prenom + "', '" + personne.tel + "', '" + personne.website + "', '" + personne.sexe + "', '" + personne.birthdate + "', '" + personne.ville + "', '" + personne.taille + "', '" + personne.couleur + "', '" + personne.profilepic + "')", function (err) {
    if (!err) {
        logger.info("Ajout d'une personne");
        session.start = true;
        session.nom = personne.nom;
        session.prenom = personne.prenom;
        session.profilepic = personne.profilepic;
        res.redirect('/profile');
    }
    else
        logger.error(err);
    });
}

function login(username, password, res) {
    connection.query("SELECT * " +
        "             FROM users " +
        "             WHERE email = '" + username + "' AND password = '" + password + "'",
        function (err, rows) {
            if(!err)
                if (rows.length > 0) {
                    session.start = true;
                    session.email = rows[0].email;
                    session.nom = rows[0].nom;
                    session.prenom = rows[0].prenom;
                    session.tel = rows[0].tel;
                    session.website = rows[0].website;
                    session.sexe = rows[0].sexe;
                    session.birthdate = rows[0].birthdate;
                    session.ville = rows[0].ville;
                    session.taille = rows[0].taille;
                    session.couleur = rows[0].couleur;
                    session.profilepic = rows[0].profilepic;
                    res.redirect('/profile');
                }
                else
                    res.redirect('/login');
            else
                logger.error(err);
    });
}

function updateUser(personne, res) {
    connection.query("  UPDATE users " +
        "               SET password = '" + personne.password + "', nom = '" + personne.nom + "', prenom = '" + personne.prenom + "', tel = '" + personne.tel + "', website = '" + personne.website + "', ville = '" + personne.ville + "', taille = '" + personne.taille + "', couleur = '" + personne.couleur + "', profilepic = '" + personne.profilepic + "'" +
        "               WHERE email = '" + session.email + "'",
        function (err) {
            if (!err) {
                logger.info("Modification d'une personne");
                session.start = true;
                session.nom = personne.nom;
                session.prenom = personne.prenom;
                session.profilepic = personne.profilepic;
                res.redirect('/profile');
            }
            else
                logger.error(err);
        });
}

function deleteAccount() {
    connection.query("  DELETE FROM users " +
        "               WHERE email = '" + session.email + "'");
}
/*
function paint(design) {
    connection.query("  INSERT INTO drawings(commands, picture, idUser) " +
        "               VALUES ('" + design.commands + "','" + design.picture +"'," + design.id + ")");
}
*/
function admin(username, password, res) {
    connection.query("SELECT * " +
        "             FROM users " +
        "             WHERE email = '" + username + "' AND password = '" + password + "'",
        function (err, rows) {
            if(!err)
                if (rows.length > 0) {
                    session.start = true;
                    session.email = rows[0].email;
                    session.prenom = rows[0].prenom;
                    session.profilepic = rows[0].profilepic;
                    res.redirect('/admin');
                }
                else
                    res.redirect('/login');
            else
                logger.error(err);
        });
}
/*
function setUsers(personne, user, res) {
    connection.query("  UPDATE users " +
        "               SET password = '" + personne.password + "', nom = '" + personne.nom + "', prenom = '" + personne.prenom + "', tel = '" + personne.tel + "', website = '" + personne.website + "', ville = '" + personne.ville + "', taille = '" + personne.taille + "', couleur = '" + personne.couleur + "', profilepic = '" + personne.profilepic + "'" +
        "               WHERE prenom = '" + user + "'",
        function (err) {
            if (!err) {
                logger.info("Modification d'un profil utilisateur");
                session.start = true;
                session.nom = personne.nom;
                session.prenom = personne.prenom;
                session.profilepic = personne.profilepic;
                res.redirect('/profile');
            }
            else
                logger.error(err);
        });
}
*/
/*
function getUsers(res) {
    connection.query("  SELECT prenom " +
        "               FROM users",
    function (err, rows) {
        if (!err) {
            logger.info('La liste des utilisateurs: ', rows);
            res.render('admin', {users: rows})
        }
    })
}
*/
//require('./services/database')(database);