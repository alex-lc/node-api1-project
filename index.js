// implement your API here
const express = require('express');

const Users = require('./data/db.js');

const server = express();

server.use(express.json()); // for post, put, and patch

// get for list of users
server.get('/api/users', (req, res) => {
    Users.find().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "The user's information could not be retrieved." });
    })
});

// post to create a user
server.post('/api/users', (req, res) => {

    const userInfo = req.body;

    // console.log(userInfo);

    if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ errorMessage: "Please provide a name and bio for the user." })
    }
    else {
        Users.insert(userInfo).then(user => {
            res.status(201).json(userInfo);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
        });
    }
});

// get a specific user by id
server.get('/api/users/:id', (req, res) => {

    const { id } = req.params;

    Users.findById(id).then(user => {
        res.status(200).json(user);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Error" });
    })
});

// delete a specific user by id
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userToRemove = req.body;

    if (userToRemove.id !== id) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }
    else {
        Users.remove(id).then(removed => {
            res.status(200).json(removed);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user could not be removed." });
        });
    }
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const newUser = req.body;

    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ errorMessage: "Please provide a name and bio for the user." });
    }
    else {
        Users.update(id, newUser).then(updatedUser => {
            if (updatedUser) {
                res.status(200).json(newUser);
            }
            else {
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user information could not be modified." });
        });
    }
});



server.listen(8000, () => console.log(`API running on prot 8000`));