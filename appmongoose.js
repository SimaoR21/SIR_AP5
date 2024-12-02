/**
 * @file appmongoose.js
 * @description This file contains a starter implementation of a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

// mongoose setup
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentsdb');

// Define the Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    study: { type: String, required: true }
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);


// CRUD endpoints
// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create a new student
//================================================================
// route to create a new student
//================================================================

app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(500).send({ error: 'Failed to create student', details: err.message });
    }
});


// Update a student by ID
//================================================================
// route to update(save) a  student
//================================================================

app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (updatedStudent) {
            res.json(updatedStudent);
        } else {
            res.status(404).send({ error: 'Student not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to update student', details: err.message });
    }
});



// Delete a student by ID
//================================================================
// route to delete a student
//================================================================

app.delete('/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (deletedStudent) {
            res.json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).send({ error: 'Student not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete student', details: err.message });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
