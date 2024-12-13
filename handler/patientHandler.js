import pool from "../config/dbConfig.js";
import formattedDate from '../config/timezoneConfig.js';
import { nanoid } from "nanoid";

const showAllPatientHandler = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, unique_id, wife_nik, wife_name, created_at FROM tb_patients");
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
  const user = req.user;
  const id = req.params.id;
  try {
    const patient_query = "SELECT * FROM tb_patients WHERE unique_id = ?";
    const examination_query = "SELECT * FROM tb_examinations WHERE patient_id = ?";
    const givebirth_query = "SELECT * FROM tb_givebirth WHERE patient_id = ?";
    const [patient_rows] = await pool.query(patient_query, [id]);
    const [examination_rows] = await pool.query(examination_query, [patient_rows.id]);
    const [givebirth_rows] = await pool.query(givebirth_query, [patient_rows.id]);

    const data_body = {
      patient: patient_rows,
      examination: examination_rows || null,
      givebirth: givebirth_rows || null
    }

    if (patient_rows.length > 0) {
      res.status(200).json({
        status: "success",
        id: patient_rows[0].unique_id,
        message: `success show patient ${patient_rows[0].wife_name}`,
        data: data_body
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
  const user = req.user;
  const uniqueId = 'patient.' + nanoid(16);

  try {
    const query = `INSERT INTO tb_patients (
    unique_id, 
    user_id,
    payment, 
    wife_nik, 
    wife_name, 
    wife_blood, 
    wife_placedob, 
    wife_education, 
    husband_nik, 
    husband_name,
    husband_blood, 
    husband_placedob, 
    husband_education, 
    religion, 
    created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await pool.query(query, [
      uniqueId,
      user.id,
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
      formattedDate(),
    ]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        patient_id: uniqueId,
        message: `success add patient ${data.wife_name}`,
        created_at: formattedDate(),
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

const patientHandler = {
  showAllPatientHandler,
  showPatientHandler,
  createGiveBirthHandler,
  createPatientHandler,
};

export default patientHandler;
