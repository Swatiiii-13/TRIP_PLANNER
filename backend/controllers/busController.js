const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getBuses = async (req, res) => {
  try {
    const { origin, destination, date, travelers } = req.query;

    if (!origin || !destination || !date || !travelers) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are a travel data API. Generate exactly 5 realistic Indian bus services from ${origin} to ${destination} for ${travelers} passengers. You MUST return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object MUST have exactly these keys: operatorName (string), busType (string), departureTime (string in HH:MM AM/PM format), arrivalTime (string in HH:MM AM/PM format), duration (string like '8h 30m'), farePerPerson (number in INR), totalFareForGroup (number in INR), amenities (array of strings). Example operator names: KSRTC, VRL Travels, SRS Travels, Orange Tours, Sharma Travels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();
    console.log("=== RAW BUS RESPONSE ===");
    console.log(rawText);
    console.log("========================");

    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (rawText.startsWith('[') === false) {
      const startIndex = rawText.indexOf('[');
      const endIndex = rawText.lastIndexOf(']');
      rawText = rawText.substring(startIndex, endIndex + 1);
    }
    const parsedData = JSON.parse(rawText);
    console.log("Parsed data:", parsedData);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching buses from Gemini:', error);
    res.status(500).json({ message: 'Failed to generate bus data' });
  }
};

module.exports = { getBuses };
