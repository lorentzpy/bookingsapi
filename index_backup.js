const Joi = require("joi");
const express = require("express");

const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"},
];

// res.send is a callback, also named route handler
app.get("/", (req, res) => {
    res.send("hello world!!!");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    // params (:id)
    //res.send(req.params);
    // querystring parameters
    //res.send(req.query);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The source with the id " + req.params.id + " not found" );
    } else {
        res.send(course);
    }
});

app.post("/api/courses", (req, res) => {

    const { error } = validateCourse(req.body);

    if (error) {
        // 400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);

    res.send(course);

});

app.put("/api/courses/:id", (req, res) => {
    // look the course up
    // non existing => 404
    // validate
    // if invalid => 400
    // update the course
    // Return updated course

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The source with the id " + req.params.id + " not found" );
    }

    const { error } = validateCourse(req.body);

    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }
    
    course.name = req.body.name;

    res.send(course);
    
});

app.delete("/api/courses/:id", (req, res) => {
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send("The source with the id " + req.params.id + " not found" );
    }

    const index = courses.indexOf(course);

    courses.splice(index, 1);

    res.send(course);


});

app.use(( req, res, next ) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use( (err, req, res, next) => {
    res.status( err.status || 500 ).json({
        error: err.message || "Internal server error"
    })
});

function validateCourse(course) {

    const schema = Joi.object({name: Joi.string().min(3).required()});

    return schema.validate(course);
}

// PORT
const port = process.env.PORT || 3100
app.listen(port, () => console.log("Listening on port " + port));