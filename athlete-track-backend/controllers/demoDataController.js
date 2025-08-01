// controllers/demoDataController.js
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const connectDB = require('../config/db');

// Config
const DEMO_ATHLETE_ID = '68729fc2d3ba0bafc93a8280';
// Sample notes
const SAMPLE_NOTES = [
    "Great session!",
    "Felt tired but pushed through",
    "Need to improve stamina",
    "Perfect weather for workout",
    "Tried new technique",
    "Focused on form",
    "Workout with friends",
    "Early morning session",
    null
];

exports.seedDemoWorkouts = async (req, res) => {
    try {
        // 1. Connect to DB
        await connectDB();

        // 2. Delete workouts older than 31 days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 31);
        const deleteOldResult = await Workout.deleteMany({
            isDemo: true,
            date: { $lt: cutoffDate }
        });

        // 3. Thin out yesterday's data (keep only 1 if 2 exist)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const yesterdayWorkouts = await Workout.find({
            isDemo: true,
            date: {
                $gte: yesterday,
                $lt: new Date(yesterday.getTime() + 86400000) // Full day range
            }
        }).sort({ createdAt: -1 }); // Newest first

        if (yesterdayWorkouts.length > 1) {
            const idsToKeep = yesterdayWorkouts[0]._id; // Keep newest
            await Workout.deleteMany({
                _id: { $in: yesterdayWorkouts.slice(1).map(w => w._id) }
            });
        }

        // 4. Seed new workouts (2 max)
        const exercises = await Exercise.find({ isDeleted: false });
        const newWorkouts = [];

        if (exercises.length > 0) {
            const shuffledExercises = [...exercises].sort(() => 0.5 - Math.random());
            const exercisesToUse = shuffledExercises.slice(0, 2);

            exercisesToUse.forEach(exercise => {
                newWorkouts.push({
                    athlete: DEMO_ATHLETE_ID,
                    exercise: exercise._id,
                    duration: faker.number.int({ min: 15, max: 90 }),
                    date: new Date(),
                    notes: SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)],
                    isDemo: true
                });
            });

            await Workout.create(newWorkouts);
        }

        res.status(201).json({
            success: true,
            deletedOld: deleteOldResult.deletedCount,
            thinnedYesterday: yesterdayWorkouts.length > 1 ? yesterdayWorkouts.length - 1 : 0,
            addedNew: newWorkouts.length,
            exercisesUsed: newWorkouts.map(w => w.exercise.toString())
        });

    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            success: false,
            error: 'Seeding failed'
        });
    }
};