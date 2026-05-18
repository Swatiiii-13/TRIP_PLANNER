const { GoogleGenerativeAI } = require('@google/generative-ai');
const Trip = require('../models/Trip');


// Initialize the Gemini AI using the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateItinerary = async (req, res) => {
  try {
    const { destination, duration, travelers, budget, preferences } = req.body;

    // Validate inputs
    if (!destination || !duration || !travelers || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get the generative model with strict JSON schema enforcement
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // Construct the prompt
    const prompt = `
You are a smart, professional travel planner.
Generate a detailed travel itinerary for the following trip:
- Destination: ${destination}
- Duration: ${duration} days
- Travelers: ${travelers}
- Budget: ${budget}
- Preferences: ${preferences && Array.isArray(preferences) ? preferences.join(', ') : 'None'}

You MUST respond strictly with a valid JSON object matching this exact structure:

{
  "tripSummary": {
    "destination": "${destination}",
    "totalDays": ${Number(duration)},
    "estimatedCost": "",
    "generalSafetyTip": ""
  },
  "itinerary": [
    {
      "day": 1,
      "theme": "",
      "morning": { "activity": "", "costEstimate": 0 },
      "afternoon": { "activity": "", "costEstimate": 0 },
      "evening": { "activity": "", "costEstimate": 0 },
      "localFoodSuggestion": ""
    }
  ]
}

Ensure that the itinerary array has exactly ${duration} items (one for each day).
`;

    // Await AI response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Parse the JSON directly
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      return res.status(500).json({ message: 'Error formatting AI response.' });
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('AI Generation error:', error);
    res.status(500).json({ message: 'Failed to generate itinerary with AI.' });
  }
};

const saveTrip = async (req, res) => {
  try {
    const { destination, duration, budget, itineraryData } = req.body;

    if (!destination || !duration || !budget || !itineraryData) {
      return res.status(400).json({ message: 'Missing required fields for saving trip' });
    }

    const trip = new Trip({
      user: req.user.id,
      destination,
      duration,
      budget,
      itineraryData,
    });

    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({ message: 'Failed to save trip to history' });
  }
};

const getTravelHistory = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching travel history:', error);
    res.status(500).json({ message: 'Failed to fetch travel history' });
  }
};

module.exports = {
  generateItinerary,
  saveTrip,
  getTravelHistory,
};