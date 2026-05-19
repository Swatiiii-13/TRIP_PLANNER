const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getHotels = async (req, res) => {
  const { destination } = req.params;
  const { budget, travelers, duration } = req.query;
  console.log("Hotel request params:", { destination, budget, travelers, duration });

  if (!destination) {
    return res.status(400).json({ message: 'Destination is required' });
  }

  try {
    const totalBudget = parseInt(String(budget).replace(/\D/g, '')) || 5000;
    const numTravelers = parseInt(travelers) || 1;
    const numDays = parseInt(duration) || 1;
    const hotelBudget = Math.round(totalBudget * 0.40);
    const maxPerNight = Math.round(hotelBudget / numDays);
    console.log("Max hotel per night:", maxPerNight);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are a hotel recommendation API for Indian travel. The user's TOTAL trip budget is ₹${totalBudget} for ${numTravelers} travelers for ${numDays} days. Maximum they can spend on hotels is ₹${hotelBudget} total, so maximum ₹${maxPerNight} per night. You MUST ONLY suggest hotels under ₹${maxPerNight} per night. STRICTLY NO hotels above this price. If maxPerNight is under ₹300, suggest dormitories or dharamshalas. If under ₹800, suggest budget lodges only. If under ₹1500, suggest budget hotels or homestays only. If under ₹3000, suggest mid-range hotels only. Destination: ${destination}. Return ONLY a valid JSON array, no markdown, no backticks. Each object must have: name (string), location (string), pricePerNight (number, MUST be under ${maxPerNight}), features (array of 3 strings).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    console.log("=== RAW HOTEL GEMINI RESPONSE ===");
    console.log(text);
    console.log("=================================");

    // Clean up markdown in case AI returns it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!text.startsWith('[')) {
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
      }
    }

    let hotels = [];
    try {
      hotels = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      return res.status(422).json({ message: 'The AI provided an incorrectly formatted response. Please try generating again.' });
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
