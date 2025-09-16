// Dashboard analytics and stats
const getStats = async (req, res) => {
  try {
    // Dummy stats data, replace with real DB aggregation as needed
    const stats = {
      totalProjects: 10,
      activeProjects: 7,
      completedProjects: 3,
      totalTasks: 50,
      completedTasks: 35,
      pendingInvoices: 5,
      paidInvoices: 20
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats };
