import { Request, Response } from "express";
import { AppDataSource } from "../scripts/data-source";
import { Court } from "../entity/Court";

const courtRepository = AppDataSource.getRepository(Court);

export const getAllCourts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courts = await courtRepository.find({
      relations: ["tournament"],
    });
    res.json({ data: courts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courts" });
  }
};

export const getCourtById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch court" });
  }
};

export const createCourt = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create court" });
  }
};

export const updateCourt = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to update court" });
  }
};

export const deleteCourt = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to delete court" });
  }
};

export const getAvailableCourts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courts = await courtRepository.find({
      where: { isAvailable: true },
      relations: ["tournament"],
    });
    res.json({ data: courts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available courts" });
  }
};
