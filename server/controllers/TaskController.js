const Task = require("../models/Task");
const Task = require("../models/Task");
const { validateObjectId } = require("../utils/Validation");

const INTERNAL_SERVER_ERROR = "Internal Server Error.";
const INVALID_TASK_ID = "Invalid task id.";
const MISSING_TASK_DESC = "Task description not found.";
const TASK_OWNED_BY_OTHER_USER = "Action rejected: task owned by another user.";

exports.getTask = async (req, res) => {
    try {
        const tasks = await Tasks.find({user: req.user.id});
        res.status(200).json({tasks, status: true, msg: "Tasks found successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: INTERNAL_SERVER_ERROR});
    }
}
exports.getTask = async (req, res) => {
    try {
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: INVALID_TASK_ID});
        }
        const task = await Task.findById({user: req.user.id, _id: req.params.taskId});
        if (!task) {
            return res.status(400).json({status: false, msg: "No tasks found."});
        }
        res.status(200).json({task, status: true, msg: "Task found successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: INTERNAL_SERVER_ERROR});
    }
}
exports.postTask = async (req, res) => {
    try {
        const {description} = req.body;
        if (!description) {
            return res.status(400).json({status: false, msg: MISSING_TASK_DESC});
        }
        const task = await Task.create({user: req.user.id, description});
        res.status(200).json({task, status: true, msg: "Task created successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: INTERNAL_SERVER_ERROR});
    }
}
exports.putTask = async (req, res) => {
    try {
        const {description} = req.body;
        if (!description) {
            return res.status(400).json({status: false, msg: MISSING_TASK_DESC})
        }
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: INVALID_TASK_ID});
        }
        let task = await Task.findById(req.params.taskId);
        if (task.user != req.user.id) {
            return res.status(403).json({status: false, msg: TASK_OWNED_BY_OTHER_USER});
        }
        task = await Task.findByIdAndUpdate(req.params.taskId, {description}, {new: true});
        res.status(200).json({task, status: true, msg: "Task updated successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: INTERNAL_SERVER_ERROR});
    }
}
exports.deleteTask = async (req, res) => {
    try {
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: INVALID_TASK_ID});
        }
        let task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(400).json({status: false, msg: "Task with given id not found."});
        }
        if (task.user != req.user.id) {
            return res.status(403).json({status: false, msg: TASK_OWNED_BY_OTHER_USER});
        }
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({status: true, msg: "Task deleted successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: 500, msg: INTERNAL_SERVER_ERROR});
    }
}