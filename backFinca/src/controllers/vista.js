// ...existing code...
const Vista = require('../models/vista.js');


const httpVisitas = {
  getVisitas: async (req, res) => {
    try {
      const v = await Vista.findOne();
      return res.json({ total: v ? v.total : 0 });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  sumarVisita: async (req, res) => {
    try {
      const v = await Vista.findOneAndUpdate(
        {},
        { $inc: { total: 1 } },
        { new: true, upsert: true }
      );
      return res.json({ total: v.total });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = { httpVisitas };