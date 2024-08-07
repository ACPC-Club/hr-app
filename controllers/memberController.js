const memberModel = require("../models/memberModel");

const getMembers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterDepartment = "",
    filterYear = "",
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  console.log("Request Query:", req.query);

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" }; // case-insensitive search
  }
  if (filterDepartment) {
    query.department = filterDepartment;
  }
  if (filterYear) {
    query.year = filterYear;
  }

  console.log("Query Object:", query);

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  console.log("Sort Options:", sortOptions);

  try {
    const members = await memberModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await memberModel.countDocuments(query);

    console.log("Members Fetched:", members);
    console.log("Total Members:", total);

    res.status(200).json({
      success: true,
      data: members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error Fetching Members:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addMember = async (req, res) => {
  const {
    userName,
    userPhone,
    userUniversityId,
    userDepartment,
    userYear,
    isBoardMember,
  } = req.body;

  console.log("Request Body:", req.body);

  let errors = {};

  // Server-side validation
  if (!userName || userName.trim() === "") {
    errors.userName = "Name is required.";
  }

  const phonePattern = /^[0-9]{10,15}$/;
  if (!userPhone || !phonePattern.test(userPhone.trim())) {
    errors.userPhone = "Phone number must be 10-15 digits.";
  }

  const universityIdPattern = /^[0-9]{4}\/[0-9]{5}$/;
  if (!userUniversityId || !universityIdPattern.test(userUniversityId.trim())) {
    errors.userUniversityId = "University ID must be in the format YYYY/XXXXX.";
  }

  if (!userDepartment || userDepartment.trim() === "") {
    errors.userDepartment = "Department is required.";
  }

  if (!userYear || userYear.trim() === "") {
    errors.userYear = "Year is required.";
  }

  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
    return res.status(400).json({ success: false, errors });
  }

  try {
    const newMember = new memberModel({
      name: userName.trim(),
      phoneNumber: userPhone.trim(),
      universityId: userUniversityId.trim(),
      department: userDepartment.trim(),
      year: userYear.trim(),
      isBoardMember: isBoardMember || false,
      warnings: [],
      points: 0,
    });

    await newMember.save();
    console.log("New Member Saved:", newMember);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error Saving Member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await memberModel.findById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const editMember = async (req, res) => {
  const {
    userId,
    userName,
    userPhone,
    userUniversityId,
    userDepartment,
    userYear,
    isBoardMember,
    userPoints,
    userWarnings,
  } = req.body;
  console.log("Request Body:", req.body);
  let errors = {};
  if (!userName || userName.trim() === "") {
    errors.userName = "Name is required.";
  }
  const phonePattern = /^[0-9]{10,15}$/;
  if (!userPhone || !phonePattern.test(userPhone.trim())) {
    errors.userPhone = "Phone number must be 10-15 digits.";
  }
  const universityIdPattern = /^[0-9]{4}\/[0-9]{5}$/;
  if (!userUniversityId || !universityIdPattern.test(userUniversityId.trim())) {
    errors.userUniversityId = "University ID must be in the format YYYY/XXXXX.";
  }
  if (!userDepartment || userDepartment.trim() === "") {
    errors.userDepartment = "Department is required.";
  }
  if (!userYear || userYear.trim() === "") {
    errors.userYear = "Year is required.";
  }
  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
    return res.status(400).json({ success: false, errors });
  }
  try {
    const member = await memberModel.findById(userId);
    member.name = userName.trim();
    member.phoneNumber = userPhone.trim();
    member.universityId = userUniversityId.trim();
    member.department = userDepartment.trim();
    member.year = userYear.trim();
    member.isBoardMember = isBoardMember || false;
    member.points = userPoints;
    member.warnings = Array.isArray(userWarnings)
      ? userWarnings
      : [userWarnings]; // Handle case where there is only one warning
    await member.save();
    console.log("Member Updated:", member);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error Updating Member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const viewMember = async (req, res) => {
  try {
    const member = await memberModel.findById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.render("memberDetail", { member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await memberModel.findByIdAndDelete(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMembers,
  addMember,
  getMemberById,
  editMember,
  viewMember,
  deleteMember,
};
