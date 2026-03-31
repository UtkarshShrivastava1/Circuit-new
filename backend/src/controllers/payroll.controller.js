const Payroll = require('../models/Payroll.model.js');
const User = require('../models/User.model.js');
const { successResponse } = require('../utils/response.js');
const { asyncHandler } = require('../middlewares/error.middleware.js');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors.js');
const logger = require("../common/libs/logger.js");

// ============================================================================
// 1. Generate Payroll (Single or Bulk)
// ============================================================================
const generatePayroll = asyncHandler(async (req, res) => {
  const { employeeId, month, year, basicSalary, allowances, deductions, bonus } = req.body;
  const orgId = req.organization._id || req.organization;
  const generatedBy = req.user.id || req.user._id;

  if (!month || month < 1 || month > 12) {
    throw new ValidationError('Valid month (1-12) is required');
  }
  if (!year) {
    throw new ValidationError('Year is required');
  }

  // If employeeId is provided, generate for a single employee
  if (employeeId) {
    const employee = await User.findOne({ _id: employeeId, organization: orgId });
    if (!employee) throw new NotFoundError('Employee not found in this organization');

    const existing = await Payroll.findOne({ organization: orgId, employee: employeeId, month, year });
    if (existing) throw new ValidationError('Payroll already exists for this employee for the given month and year');

    const payroll = await Payroll.create({
      organization: orgId,
      employee: employeeId,
      month,
      year,
      basicSalary: basicSalary || 0,
      allowances: allowances || 0,
      deductions: deductions || 0,
      bonus: bonus || 0,
      status: 'PENDING',
      generatedBy
    });

    return successResponse(res, 'Payroll generated successfully', payroll);
  } 
  
  // BULK GENERATION: If no employeeId is provided, generate for all active employees
  const employees = await User.find({ organization: orgId, status: 'active', role: 'member' }).lean();
  if (!employees.length) throw new NotFoundError('No active employees found to generate payroll');

  const payrollData = employees.map(emp => ({
    organization: orgId,
    employee: emp._id,
    month,
    year,
    basicSalary: emp.salary || basicSalary || 0, // Fallback to user model salary if available
    allowances: allowances || 0,
    deductions: deductions || 0,
    bonus: bonus || 0,
    status: 'PENDING',
    generatedBy
  }));

  // Use bulkWrite to insert new records and skip duplicates seamlessly
  const bulkOps = payrollData.map(data => ({
    updateOne: {
      filter: { organization: data.organization, employee: data.employee, month: data.month, year: data.year },
      update: { $setOnInsert: data },
      upsert: true
    }
  }));

  const result = await Payroll.bulkWrite(bulkOps);

  return successResponse(res, `Bulk payroll generation complete. Created: ${result.upsertedCount}`, {
    totalProcessed: employees.length,
    newlyCreated: result.upsertedCount
  });
});

// ============================================================================
// 2. Update Payroll (Modify salary fields before approval)
// ============================================================================
const updatePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { basicSalary, allowances, deductions, bonus } = req.body;
  const orgId = req.organization._id || req.organization;

  const payroll = await Payroll.findOne({ _id: id, organization: orgId });
  
  if (!payroll) {
    throw new NotFoundError('Payroll record');
  }

  if (payroll.status !== 'PENDING') {
    throw new ForbiddenError('Only PENDING payrolls can be modified');
  }

  if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
  if (allowances !== undefined) payroll.allowances = allowances;
  if (deductions !== undefined) payroll.deductions = deductions;
  if (bonus !== undefined) payroll.bonus = bonus;

  // The pre-validate hook in the model will automatically recalculate the netSalary
  await payroll.save();

  return successResponse(res, 'Payroll updated successfully', payroll);
});

// ============================================================================
// 3. Approve Payroll
// ============================================================================
const approvePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const orgId = req.organization._id || req.organization;

  const payroll = await Payroll.findOne({ _id: id, organization: orgId });

  if (!payroll) {
    throw new NotFoundError('Payroll record');
  }

  if (payroll.status !== 'PENDING') {
    throw new ValidationError(`Payroll is currently ${payroll.status} and cannot be approved again.`);
  }

  payroll.status = 'PROCESSED';
  await payroll.save();

  return successResponse(res, 'Payroll approved successfully', payroll);
});

// ============================================================================
// 4. Mark as Paid
// ============================================================================
const payPayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const orgId = req.organization._id || req.organization;

  const payroll = await Payroll.findOne({ _id: id, organization: orgId });

  if (!payroll) {
    throw new NotFoundError('Payroll record');
  }

  if (payroll.status === 'PAID') {
    throw new ValidationError('Payroll has already been paid');
  }

  if (payroll.status === 'PENDING') {
    throw new ValidationError('Payroll must be PROCESSED before it can be marked as PAID');
  }

  payroll.status = 'PAID';
  payroll.paidAt = new Date();
  
  await payroll.save();

  return successResponse(res, 'Payroll marked as paid', payroll);
});

// ============================================================================
// 5. Get My Payroll (Employee views their own salary)
// ============================================================================
const getMyPayroll = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const orgId = req.organization._id || req.organization;
  const { month, year, page = 1, limit = 10 } = req.query;

  const filter = {
    organization: orgId,
    employee: userId
  };

  if (month) filter.month = Number(month);
  if (year) filter.year = Number(year);

  const skip = (Number(page) - 1) * Number(limit);

  const payrolls = await Payroll.find(filter)
    .sort({ year: -1, month: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Payroll.countDocuments(filter);

  return successResponse(res, 'My payroll records retrieved successfully', {
    payrolls,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// ============================================================================
// 6. Get All Payroll (Admin/Manager views all with filters)
// ============================================================================
const getAllPayroll = asyncHandler(async (req, res) => {
  const orgId = req.organization._id || req.organization;
  const { month, year, employeeId, status, page = 1, limit = 10 } = req.query;

  const filter = { organization: orgId };

  if (month) filter.month = Number(month);
  if (year) filter.year = Number(year);
  if (employeeId) filter.employee = employeeId;
  if (status) filter.status = status.toUpperCase();

  const skip = (Number(page) - 1) * Number(limit);

  const payrolls = await Payroll.find(filter)
    .populate('employee', 'name email designation employeeId')
    .populate('generatedBy', 'name email')
    .sort({ year: -1, month: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Payroll.countDocuments(filter);
  
  // Optional: Calculate totals for the filtered view
  const aggregation = await Payroll.aggregate([
    { $match: filter },
    { 
      $group: { 
        _id: null, 
        totalNetSalary: { $sum: "$netSalary" },
        totalDeductions: { $sum: "$deductions" }
      } 
    }
  ]);
  const totals = aggregation[0] || { totalNetSalary: 0, totalDeductions: 0 };

  return successResponse(res, 'Payroll records retrieved successfully', {
    payrolls,
    summary: totals,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

module.exports = {
  generatePayroll,
  updatePayroll,
  approvePayroll,
  payPayroll,
  getMyPayroll,
  getAllPayroll
};