const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getHotels = async (req, res) => {
  const { destination } = req.params;

  if (!destination) {
    return res.status(400).json({ message: 'Destination is required' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are a travel agent. Provide exactly 3 real, popular hotels located in ${destination}. Return a JSON array of objects. Each object must have: id (number), name (string, the real hotel name), location (string, the neighborhood/area in the city), price (number, realistic price in INR), and features (array of 3 short strings like 'Free Breakfast', 'Pool').`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    let hotels = [];
    try {
      hotels = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      return res.status(500).json({ message: 'Error formatting AI response.' });
    }

    // Map over array to inject dynamic Pollinations AI imageUrl
    hotels = hotels.map(hotel => ({
      ...hotel,
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(hotel.name + ' hotel in ' + destination)}?width=800&height=400&nologo=true`
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels from AI:', error);
    res.status(500).json({ message: 'Failed to fetch hotels dynamically.' });
  }
};

module.exports = { getHotels };
