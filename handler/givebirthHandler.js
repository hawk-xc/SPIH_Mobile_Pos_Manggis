import pool from "../config/dbConfig.js";
import formattedDate from '../config/timezoneConfig.js';
import { nanoid } from "nanoid";

const showAllGivebirthHandler = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tb_givebirth");
        res.status(200).json({
            status: "success",
            message: "success show all givebirth",
            data: rows,
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `error: ${error}`,
        });
    }
}

const showGivebirthHandler = async (req, res) => {
    const id = req.params.id;

    try {
        const [rows] = await pool.query("SELECT * FROM tb_givebirth WHERE id = ?", [id]);

        if (rows.length > 0) {
            res.status(200).json({
                status: "success",
                id: id,
                givebirth_id: rows[0].id,
                message: "success show givebirth",
                data: rows,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "givebirth data not found",
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `error: ${error}`,
        });
    }
}

const createGivebirthHandler = async (req, res) => {
    const data = req.body;

    try {
        const query = `INSERT INTO tb_givebirth (
        patient_id,
        birth_date,
        gestational_age,
        gestational_place, 
        gender,
        height,
        weight,
        created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const [rows] = await pool.query(query, [
            data.patient_id,
            data.birth_date,
            data.gestational_age,
            data.gestational_place,
            data.gender,
            data.height,
            data.weight,
            formattedDate()
        ]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                status: "success",
                message: `success add give birth ${rows.insertId}`,
                data: rows,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "error add give birth",
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `error: ${error}`,
        });
    }
};

const updateGivebirthHandler = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const [givebirthRows] = await pool.query("SELECT * FROM tb_givebirth WHERE id = ?", [id]);
        const givebirthId = givebirthRows[0];

        const query = `UPDATE tb_givebirth SET
        birth_date = ?,
        gestational_age = ?,
        gestational_place = ?,
        gender = ?,
        height = ?,
        weight = ?
        WHERE id = ?`;

        const [rows] = await pool.query(query, [
            body.birth_date || givebirthId.birth_date,
            body.gestational_age || givebirthId.gestational_age,
            body.gestational_place || givebirthId.gestational_place,
            body.gender || givebirthId.gender,
            body.height || givebirthId.height,
            body.weight || givebirthId.weight,
            id
        ]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                status: "success",
                message: `success update give birth ${givebirthId.id}`,
                data: rows,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "error update give birth",
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `error: ${error}`
        })
    }
};

const deleteGivebirthHandler = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await pool.query("DELETE FROM tb_givebirth WHERE id = ?", [id]);
        if (rows.affectedRows > 0) {
            res.status(200).json({
                status: "success",
                message: `success delete give birth ${id}`,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: `error delete give birth ${id}`,
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `error: ${error}`,
        });
    }
};

const givebirthHandler = {
    showAllGivebirthHandler,
    showGivebirthHandler,
    createGivebirthHandler,
    updateGivebirthHandler,
    deleteGivebirthHandler
};

export default givebirthHandler;