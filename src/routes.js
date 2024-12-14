import express from "express";
const route = express.Router();
import userHandler from "../handler/userHandler.js";
import jwtAuthToken from "../middleware/jwtAuthToken.js";
import validation from "../middleware/validation.js";
import patientHandler from "../handler/patientHandler.js";
import examinationHandler from "../handler/examinationHandler.js";

route.get("/", userHandler.baseUrlHandler);

// Login Register Route
route.post("/login", validation.loginInputValidation, userHandler.loginHandler);
route.post("/register", validation.registerInputValidation, validation.passwordValidation, userHandler.registerHandler);

// Auth Section Route
route.get("/profile", jwtAuthToken, userHandler.profileHandler);
route.put("/profile", jwtAuthToken, userHandler.updateProfileHandler);
route.put("/profile/changepassword", jwtAuthToken, validation.passwordValidation, userHandler.changePasswordHandler);

// Patient Section Route
route.get("/patient", jwtAuthToken, patientHandler.showAllPatientHandler);
route.get("/patient/:id", jwtAuthToken, patientHandler.showPatientHandler);
route.post("/patient", jwtAuthToken, patientHandler.createPatientHandler);
route.put("/patient/:id", jwtAuthToken, patientHandler.updatePatientHandler);
route.delete("/patient/:id", jwtAuthToken, patientHandler.deletePatientHandler);
route.get('/patient/:id/examination', jwtAuthToken, patientHandler.showAllExaminationHandler);
route.get('/patient/:id/givebirth', jwtAuthToken, patientHandler.showAllGiveBirthHandler);

route.get('/examination', jwtAuthToken, examinationHandler.showAllExaminationHandler);
route.post('/examination', jwtAuthToken, examinationHandler.createExaminationHandler);
route.put('/examination/:id', jwtAuthToken, examinationHandler.updateExaminationHandler);
route.get('/examination/:id', jwtAuthToken, examinationHandler.showExaminationHandler);
route.delete('/examination/:id', jwtAuthToken, examinationHandler.deleteExaminationHandler);

route.all("*", userHandler.missingUrlHandler);

export default route;
