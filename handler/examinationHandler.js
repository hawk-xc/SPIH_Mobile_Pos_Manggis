import pool from "../config/dbConfig.js";
import formattedDate from '../config/timezoneConfig.js';

const createExaminationHandler = async (req, res) => {
  const data = req.body;

  try {
    const [userRows] = await pool.query(
      "SELECT * FROM tb_patients WHERE id = ?", [data.patient_id]
    );

    if (userRows.length > 0) {
        const query = `INSERT INTO tb_examinations (
            patient_id,
            body_weight,
            gestational_age,
            fundal_height,
            leg_swelling,
            action_desc,
            checkup_date,
            checkup_back_date,
            created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
          const [rows] = await pool.query(query, [
            data.patient_id,
            data.body_weight,
            data.gestational_age,
            data.fundal_height,
            data.leg_swelling,
            data.action_desc,
            data.checkup_date,
            data.checkup_back_date,
            formattedDate(),
          ]);
      
          if (rows.affectedRows > 0) {
            res.status(200).json({
              status: "success",
              id: rows.insertId,
              message: `success add examination ${userRows[0].wife_name} with id ${rows.insertId}`,
            });
          }
        }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
};

const updateExaminationHandler = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const [examinationRows] = await pool.query("SELECT * FROM tb_examinations WHERE id = ?", [id]);
    const examinationId = examinationRows[0];

    const query = `UPDATE tb_examinations SET
    body_weight = ?,
    gestational_age = ?,
    fundal_height = ?,
    leg_swelling = ?,
    action_desc = ?,
    checkup_date = ?,
    checkup_back_date = ?
    WHERE id = ?`;

    const [rows] = await pool.query(query, [
      body.body_weight || examinationId.body_weight,
      body.gestational_age || examinationId.gestational_age,
      body.fundal_height || examinationId.fundal_height,
      body.leg_swelling || examinationId.leg_swelling,
      body.action_desc || examinationId.action_desc,
      body.checkup_date || examinationId.checkup_date,
      body.checkup_back_date || examinationId.checkup_back_dat,
      id
    ]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        id: id,
        message: `success update examination ${id}`,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error update examination ${id}`,
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
  try {
    const [rows] = await pool.query("SELECT * FROM tb_examinations");
    if(rows.length > 0) {
      res.status(200).json({
        status: "success",
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

const showExaminationHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM tb_examinations WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        id: id,
        examination_id: rows[0].id,
        message: "success show examination",
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
    })
  }
};

const deleteExaminationHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query("DELETE FROM tb_examinations WHERE id = ?", [id]);
    if (rows.affectedRows > 0) {
      res.status(200).json({
        status: "success",
        message: `success delete examination ${id}`,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `error delete examination ${id}`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `error: ${error}`,
    });
  }
}

const examinationHandler = {
  createExaminationHandler,
  showAllExaminationHandler,
  updateExaminationHandler,
  showExaminationHandler,
  deleteExaminationHandler
};

export default examinationHandler;
