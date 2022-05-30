const asyncHandler = require('express-async-handler');

const Goal = require('./../model/goalModel');
const User = require('./../model/userModel');

// @desc => Get Goals
// @desc => GET /api/goals
// @access => Private
const getGoals = asyncHandler(async (req, res) => {

    const goals = await Goal.findbyId({ user: req.user.id });


    res.status(200).json({
        message: "Goals fetched successfully!",
        "goals": goals
    })
});

// @desc => Set Goal
// @desc => POST /api/goals
// @access => Private
const setGoal = asyncHandler(async (req, res) => {

    if (!req.body.text) {
        res.status(400)
        throw new Error("Please enter some text");
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json({
        message: "Goal created successfully!",
        goal: goal
    });

});

// @desc => Update Goal
// @desc => PUT /api/goals
// @access => Private
const updateGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400)
        throw new Error(`Goal with ID ${req.params.id} not found`)
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (goal.user.toString() !== user.id) {

        res.status(401)
        throw new Error('You are not authorized to update this goal')

    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
        message: `Goal with ID ${req.params.id} has been updated successfully!`,
        updatedGoal: updatedGoal
    })
});

// @desc => Delete Goal
// @desc => DELETE /api/goals
// @access => Private
const deleteGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400)
        throw new Error(`Goal with ID ${req.params.id} not found`)
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (goal.user.toString() !== user.id) {

        res.status(401)
        throw new Error('You are not authorized to delete this goal')

    }

    await goal.remove();

    res.status(200).json({
        message: `Goal with ID ${req.params.id} has been deleted successfully!`
    })
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}

