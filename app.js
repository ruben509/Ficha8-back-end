const { response } = require('express');
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const swaggerJsDocs =require('swagger-jsdoc');
const swaggerUi  =require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerOptions = {
    swaggerDefinition: {
        info:{
          version:"1.0.0",
          title:"Ficha 7 API",
          description:"Ficha 7 API Information" , 
          contact:{
                 name:"TPSI-DWB"
            },
          servers:["http:localhost:3000"],
        },
        definitions:{ 
            "Person":{
                "type":"object",
                "properties":{
                    "id": {
                        "type":"integer",
                        "x-primary-key":true
                    },
                    "fristname": {
                        "type":"string"
                        
                    },
                    "lastname": {
                        "type":"string"
                        
                    },
                    "profession": {
                        "type":"string",
                    },
                    "age": {
                        "type":"integer",
                        "format":"int64"
                    }
                },
            }
        },
    

    },
    apis:["app.js"]
};




const swaggerDocs = swaggerJsDocs(swaggerOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ficha7'
});

/**
 * @swagger
 * /persons:
 *      get:
 *          tags:
 *           - Person
 *          summary: Gets a list of persons
 *          description: Returns a list of persons
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: An array of persons
 *                  schema:
 *                      $ref: '#/definitions/Person'
 */
app.get('/persons', (req, res) => {
    
    dbConnection.query('SELECT * FROM persons', (error, results, fields) => {
        if(error) {
            return res.status(404).send(error.message);
        }
        res.send(results);
    });

});

/**
 * @swagger
 * /persons:
 *      post:
 *          tags:
 *           - Person
 *          summary: Gets and stores a persons
 *          description: Returns the id of the created persons
 *          produces:
 *              - application/json
 *          parameters:
 *              -  name: Model
 *                 description: Sample person
 *                 in: body
 *                 required: true
 *                 schema:
 *                      $ref: '#/definitions/Person'
 *          responses:
 *              200:
 *                  description: Successfully created
 *                 
 */
app.post('/persons', (req, res) => {
    var details = req.body;

    dbConnection.query('INSERT INTO persons SET ?', [details] , (error, results, fields) => {
        if(error) {
            res.status(404).send(error.message);
        }
        res.send(results.insertId.toString());
    });

});
/**
 * @swagger
 * /persons:
 *      delete:
 *          tags:
 *           - Person
 *          summary: Gets a list of persons
 *          description: Returns a list of persons
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: An array of persons
 *                  schema:
 *                      $ref: '#/definitions/Person'
 */
app.delete('/persons', (req, res) => {
    var id = req.body.id;

    dbConnection.query('DELETE FROM persons WHERE id = ?', id, (error, results, fields) => {
        if(error) {
            res.status(404).send(error.message);
        }
        res.send("Deleted " + results.affectedRows + " entries");
    });
});

/**
 * Delete Person (Params)
 */
 app.delete('/persons/:id', (req, res) => {
    var id = req.params.id;

    dbConnection.query('DELETE FROM persons WHERE id = ?', id, (error, results, fields) => {
        if(error) { 
            res.status(404).send(error.message);
        }
        res.send("Deleted " + results.affectedRows + " entry(s)");
    });
});

/**
 * @swagger
 * /persons/{id}:
 *      get:
 *          tags:
 *           - Person
 *          summary: updates and stores a persons
 *          description: Returns the id of updated persons
 *          produces:
 *              - application/json
 *          parameters:
 *               - name: id
 *                 description: persons id
 *                 in: path
 *                 required: true
 *                 type: String
 *               - name: Model
 *                 description: Sample person
 *                 in: body
 *                 required: true
 *                 schema:
 *                      $ref: '#/definitions/Person'
 *          responses:
 *              200:
 *                  description: An array of persons
 *                 
 */
app.get('/persons/:id', (req, res) => {
    var id = req.params.id;

    dbConnection.query('SELECT * FROM persons WHERE id = ?', id, (error, results, fields) => {
        if(error) {
            res.status(404).send(error.message);
        }

        if(results.length == 0) {
            res.status(404).send("ID not found!"); 
        } else {
            res.send(results);
        }
        
    });
});

/**
 * @swagger
 * /persons/{age}/{profression}:
 *      get:
 *          tags:
 *           - Person
 *          summary: updates and stores a persons
 *          description: Returns the id of updated persons
 *          produces:
 *              - application/json
 *          parameters:
 *               - name: age
 *                 description: persons age
 *                 in: path
 *                 required: true
 *                 type: string
 *               - name: profression
 *                 description: presons profession
 *                 in: path
 *                 required: true
 *                 type: string
 *                 schema:
 *                      $ref: '#/definitions/Person'
 *          responses:
 *              200:
 *                  description: An array of persons
 *                  
 */
app.get('/persons/:age/:profession', (req, res) => {
    var age = req.params.age;
    var profession = req.params.profession;

    dbConnection.query('SELECT * FROM persons WHERE age = ? AND profession = ?',[age, profession], (error, results, fields) => {
        if(error) {
            res.status(404).send(error.message);
        }

        if(results.length == 0) {
            res.status(404).send("Users not found!"); 
        } else {
            res.send(results);
        }
    });
});

/**
 * @swagger
 * /persons/{id}:
 *      put:
 *          tags:
 *           - Person
 *          summary: updates and stores a persons
 *          description: Returns the id of updated persons
 *          produces:
 *              - application/json
 *          parameters:
 *               - name: Id
 *                 description: persons id
 *                 in: path
 *                 required: true
 *                 type: string
 *               - name: Model
 *                 description: Sample person
 *                 in: body
 *                 required: true
 *                 schema:
 *                      $ref: '#/definitions/Person'
 *          responses:
 *              200:
 *                  description: An array of persons
 *                  
 */
app.put('/persons/:id', (req, res) => {
    var id = req.params.id;
    var details = req.body;

    dbConnection.query('UPDATE persons SET ? WHERE id = ?',[details, id], (error, results, fields) => {
        if(error) {
            res.status(404).send(error.message);
        }

        if(results.length == 0) {
            res.status(404).send("ID not found!"); 
        } else {
            details = {
                id,
                ...details
            }
            res.send(details);
        }
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});