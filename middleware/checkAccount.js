const User = require('../models/userModel');

const checkAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    if (user.isPremium) {

      return next();
    }

    let pas, vest, concurso;
    if (user.pasUnb && user.pasUnb.length > 0) {
      pas = user.pasUnb.length;
    } else {
      pas = 0;
    }

    if (user.vestUnb && user.vestUnb.length > 0) {
      vest = user.vestUnb.length;
    } else {
      vest = 0;
    }

    if (user.concurso && user.concurso.length > 0) {
      concurso = user.concurso.length;
    } else {
      concurso = 0;
    }

    const userlength = pas + vest + concurso;

    if (userlength < 2) {
      return next();
    } else {
      return res.status(400).json({
        message: `Voce nao pode fazer, ja tem ${userlength} Cadastrados `,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error retrieving data' });
  }
};

module.exports = { checkAccount };
