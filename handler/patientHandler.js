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
    const [patient_rows] = await pool.query(patient_query, [id]);

    if (patient_rows.length > 0) {
      res.status(200).json({
        status: "success",
        id: patient_rows[0].unique_id,
        message: `success show patient ${patient_rows[0].wife_name}`,
        data: patient_rows
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `data not found with unique_id ${id}`,
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

const updatePatientHandler = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  try {
    let patientData = await pool.query('SELECT * FROM tb_patients WHERE unique_id = ?', [id]);
    patientData = patientData[0];

    const query = `UPDATE tb_patients SET
    payment = ?, 
    wife_nik = ?, 
    wife_name = ?, 
    wife_blood = ?, 
    wife_placedob = ?, 
    wife_education = ?, 
    husband_nik = ?, 
    husband_name = ?, 
    husband_blood = ?, 
    husband_placedob = ?, 
    husband_education = ?, 
    religion = ?
    WHERE unique_id = ?`;

    const [rows] = await pool.query(query, [
      data.payment || patientData[0].payment,
      data.wife_nik || patientData[0].wife_nik,
      data.wife_name || patientData[0].wife_name,
      data.wife_blood || patientData[0].wife_blood,
      data.wife_placedob || patientData[0].wife_placedob,
      data.wife_education || patientData[0].wife_education,
      data.husband_nik || patientData[0].husband_nik,
      data.husband_name || patientData[0].husband_name,
      data.husband_blood || patientData[0].husband_blood,
      data.husband_placedob || patientData[0].husband_placedob,
      data.husband_education || patientData[0].husband_education,
      data.religion || patientData[0].religion,
      id
    ]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: `success update patient ${patientData[0].unique_id}`,
        updated_at: formattedDate(),
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    })
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

const deletePatientHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query("DELETE FROM tb_patients WHERE unique_id = ?", [id]);
    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: `success delete patient ${id}`,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error delete patient ${id}`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const showAllExaminationHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const [patient_rows] = await pool.query("SELECT * FROM tb_patients WHERE unique_id = ?", [id]);
    const [rows] = await pool.query("SELECT * FROM tb_examinations where patient_id = ?", [patient_rows[0].id]);
    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        id: id,
        examination_id: rows[0].id,
        message: "success show all examination",
        data: rows,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "examination data not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const showAllGiveBirthHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const [patient_rows] = await pool.query("SELECT * FROM tb_patients WHERE unique_id = ?", [id]);
    const [rows] = await pool.query("SELECT * FROM tb_givebirth where patient_id = ?", [patient_rows[0].id]);
    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        id: id,
        givebirth_id: rows[0].id,
        message: "success show all givebirth",
        data: rows,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `givebirth data not found`,
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
  updatePatientHandler,
  deletePatientHandler,
  showAllExaminationHandler,
  showAllGiveBirthHandler
};

export default patientHandler;
