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

const examinationHandler = {
  createExaminationHandler,
};

export default examinationHandler;
