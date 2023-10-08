const Message = require("../../models/message");

const sendMessage = async (req, res) => {
    try { 
        if (req.body) {
            const { name, email, message } = req.body;
            const newMessage = new Message({ name, email, message }); // Corrected to use 'new Message()'
            await newMessage.save();
            res.status(200).json({ message: "Mensagem enviada com sucesso" });
        } else {
            res.status(400).json({ message: "Erro ao enviar mensagem" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { sendMessage };
