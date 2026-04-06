import express from 'express';
import {
  getEmployeePayrollStats,
  calculateAndSetSalary,
  runMonthlyPayroll,
  getUnifiedEmployeeList,
  getPayrollSummary,
  getPayrollStructure,
  markPayrollPaid,
  getMonthlyPayroll,
  deleteDraftPayroll,
  getPayrollDetails,
  downloadSalarySlip,
  getMySalaryHistory,
  updateCompanyPayrollPolicy,
  getCompanyPayrollPolicy
} from '../admin.payroll.controller.js';

// import { protect } from '../middleware/auth.middleware.js'; // <-- Import your authentication middleware here

const router = express.Router();

// Apply authentication middleware to all routes (Uncomment when available)
// router.use(protect);

// --- Company Policy Routes ---
router.route('/policy')
  .get(getCompanyPayrollPolicy)
  .post(updateCompanyPayrollPolicy);

// --- Dashboard & Summary Routes ---
router.get('/summary', getPayrollSummary);
router.get('/stats', getEmployeePayrollStats);
router.get('/employees', getUnifiedEmployeeList);

// --- Salary Structure Setup ---
router.post('/structure', calculateAndSetSalary);
router.get('/structure/:employeeId', getPayrollStructure);

// --- Monthly Payroll Processing ---
router.post('/run', runMonthlyPayroll);
router.get('/monthly', getMonthlyPayroll);
router.delete('/draft/:payrollId', deleteDraftPayroll);

// --- Individual Payroll Slip Management ---
router.get('/slip/:slipId', getPayrollDetails);
router.patch('/slip/:slipId/mark-paid', markPayrollPaid);
router.get('/slip/:slipId/download', downloadSalarySlip);

// --- Employee Self-Service Route ---
router.get('/my-history', getMySalaryHistory);

export default router;