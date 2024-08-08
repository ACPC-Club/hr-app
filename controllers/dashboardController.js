const memberModel = require("../models/memberModel");

const getStatistics = async (req, res) => {
  try {
    const totalMembers = await memberModel.countDocuments();
    const boardMembers = await memberModel.countDocuments({
      isBoardMember: true,
    });
    const totalWarnings = await memberModel.aggregate([
      { $unwind: "$warnings" },
      { $count: "totalWarnings" },
    ]);
    const totalPoints = await memberModel.aggregate([
      { $group: { _id: null, totalPoints: { $sum: "$points" } } },
    ]);
    const membersPerDepartment = await memberModel.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const membersPerYear = await memberModel.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
    ]);
    const avgPoints = await memberModel.aggregate([
      { $group: { _id: null, avgPoints: { $avg: "$points" } } },
    ]);
    const membersWithWarnings = await memberModel.countDocuments({
      warnings: { $exists: true, $not: { $size: 0 } },
    });

    res.json({
      stats: {
        totalMembers,
        boardMembers,
        totalWarnings: totalWarnings[0]?.totalWarnings || 0,
        totalPoints: totalPoints[0]?.totalPoints || 0,
        membersPerDepartment,
        membersPerYear,
        avgPoints: avgPoints[0]?.avgPoints || 0,
        membersWithWarnings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getStatistics,
};
