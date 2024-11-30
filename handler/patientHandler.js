import pool from "../config/dbConfig.js";
import { nanoid } from "nanoid";

const showAllPatientHandler = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tb_patient");
    res.status(200).json({
      status: "success",
      message: "success show all patient",
      data: rows,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const showPatientHandler = async (req, res) => {
  try {
    const query = `
        SELECT tb_patient.unique_id, tb_patient.payment, tb_patient.created_at, 
        tb_examination.body_weight, tb_examination.gestational_age, tb_examination.fundal_height, 
        tb_examination.leg_swealing, tb_examination.checkup_date, tb_examination.checkupback_date,
        tb_give_birth.birth_date, tb_give_birth.gestational_age, tb_give_birth.gender, tb_give_birth.height, tb_give_birth.weight
        FROM tb_patient
        LEFT JOIN tb_examination ON tb_patient.unique_id = tb_examination.patient_id
        LEFT JOIN tb_give_birth ON tb_patient.unique_id = tb_give_birth.patient_id
        WHERE tb_patient.unique_id = ?`;

    const [rows] = await pool.query(query, [req.params.unique_id]);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: `success show patient ${req.params.unique_id}`,
        data: rows,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error show patient ${req.params.unique_id}`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const createPatientHandler = async (req, res) => {
  const data = req.body;
  const uniqueId = nanoid(16);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  try {
    const query = `INSERT INTO tb_patient (
    unique_id, 
    payment, 
    wife_nik, 
    wife_name, 
    wife_blood, 
    wife_placedob, 
    wife_education, 
    husband_nik, 
    hustand_name,
    husband_blood, 
    husbang_placedob, 
    husband_education, 
    religion, 
    created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await pool.query(query, [
      uniqueId,
      data.payment,
      data.wife_nik,
      data.wife_name,
      data.wife_blood,
      data.wife_placedob,
      data.wife_education,
      data.husband_nik,
      data.husband_name,
      data.husband_blood,
      data.husbang_placedob,
      data.husband_education,
      data.religion,
      formattedDate,
    ]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: `success add patient ${data.wife_name}`,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error add patient ${data.wife_name}`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const createGiveBirthHandler = async (req, res) => {
  const data = req.body;
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  try {
    const query = `INSERT INTO tb_give_birth (
    patient_id,
    birth_date,
    gestational_age,
    gestational_place, 
    gender,
    height,
    weight,
    created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [rows] = await pool.query(query, [
      data.patient_id,
      data.birth_date,
      data.gestational_age,
      data.gestational_place,
      data.gender,
      data.height,
      data.weight,
      formattedDate,
    ]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: `success add give birth ${data.wife_name}`,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error add give birth ${data.wife_name}`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const createExaminationHandler = async (req, res) => {
  const data = req.body;
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  try {
    const query = `INSERT INTO tb_examination (
    patient_id,
    body_weight,
    gestational_age,
    fundal_height,
    leg_swealing,
    action_description,
    checkup_date,
    checkupback_date,
    created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [rows] = await pool.query(query, [
      data.patient_id,
      data.body_weight,
      data.gestational_age,
      data.fundal_height,
      data.leg_swealing,
      data.action_description,
      data.checkup_date,
      data.checkupback_date,
      formattedDate,
    ]);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const patientHandler = {
  showAllPatientHandler,
  showPatientHandler,
  createGiveBirthHandler,
  createPatientHandler,
  createExaminationHandler,
};

export default patientHandler;
