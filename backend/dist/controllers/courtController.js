"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableCourts = exports.deleteCourt = exports.updateCourt = exports.createCourt = exports.getCourtById = exports.getAllCourts = void 0;
const data_source_1 = require("../data-source");
const Court_1 = require("../entity/Court");
const courtRepository = data_source_1.AppDataSource.getRepository(Court_1.Court);
const getAllCourts = async (req, res) => {
    try {
        const courts = await courtRepository.find({
            relations: ["tournament"],
        });
        res.json({ data: courts });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch courts" });
    }
};
exports.getAllCourts = getAllCourts;
const getCourtById = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await courtRepository.findOne({
            where: { id },
            relations: ["tournament"],
        });
        if (!court) {
            res.status(404).json({ error: "Court not found" });
            return;
        }
        res.json({ data: court });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch court" });
    }
};
exports.getCourtById = getCourtById;
const createCourt = async (req, res) => {
    try {
        const { name, location, tournamentId } = req.body;
        const court = courtRepository.create({
            name,
            location,
            tournamentId,
            isAvailable: true,
        });
        const savedCourt = await courtRepository.save(court);
        const fullCourt = await courtRepository.findOne({
            where: { id: savedCourt.id },
            relations: ["tournament"],
        });
        res.status(201).json({ data: fullCourt });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create court" });
    }
};
exports.createCourt = createCourt;
const updateCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const court = await courtRepository.findOne({
            where: { id },
        });
        if (!court) {
            res.status(404).json({ error: "Court not found" });
            return;
        }
        await courtRepository.update(id, updateData);
        const updatedCourt = await courtRepository.findOne({
            where: { id },
            relations: ["tournament"],
        });
        res.json({ data: updatedCourt });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update court" });
    }
};
exports.updateCourt = updateCourt;
const deleteCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await courtRepository.findOne({
            where: { id },
        });
        if (!court) {
            res.status(404).json({ error: "Court not found" });
            return;
        }
        await courtRepository.remove(court);
        res.json({ message: "Court deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete court" });
    }
};
exports.deleteCourt = deleteCourt;
const getAvailableCourts = async (req, res) => {
    try {
        const courts = await courtRepository.find({
            where: { isAvailable: true },
            relations: ["tournament"],
        });
        res.json({ data: courts });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch available courts" });
    }
};
exports.getAvailableCourts = getAvailableCourts;
