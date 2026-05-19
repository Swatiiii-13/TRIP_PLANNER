const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a helpful and knowledgeable Live AI Travel Agent for a smart trip planner.
Context about the user's current trip or destination: ${context || 'General travel inquiry'}

User message: ${message}

Provide a concise, helpful, and friendly response. If mentioning any prices, budgets, or costs, strictly use Indian Rupees (INR) and the ₹ symbol with realistic Indian market estimates.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: 'Failed to process chat message' });
  }
};

module.exports = { handleChat };
