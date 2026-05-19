const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.get('/', async (req, res) => {
  try {
    const { origin, destination, date, travelers } = req.query;

    if (!origin || !destination || !date || !travelers) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a travel data API. Generate exactly 5 realistic Indian domestic flights from ${origin} to ${destination} on ${date} for ${travelers} passengers. You MUST return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object MUST have exactly these keys: airlineName (string, use real Indian airlines like IndiGo, Air India, SpiceJet, Vistara, GoFirst, Akasa Air), flightNumber (string like '6E-234'), departureTime (string in HH:MM AM/PM format), arrivalTime (string in HH:MM AM/PM format), duration (string like '1h 20m'), stops (string like 'Non-stop' or '1 Stop'), farePerPerson (number in INR, realistic Indian domestic fare between 2500 and 15000), totalFareForGroup (number in INR, farePerPerson multiplied by number of travelers), class (string like 'Economy'). Use realistic flight numbers and timings.`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    console.log("=== RAW FLIGHT RESPONSE ===");
    console.log(rawText);
    console.log("===========================");
    
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!rawText.startsWith('[')) {
      const startIndex = rawText.indexOf('[');
      const endIndex = rawText.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        rawText = rawText.substring(startIndex, endIndex + 1);
      }
    }
    
    console.log("Raw flight response:", rawText);
    const parsedData = JSON.parse(rawText);
    
    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

module.exports = router;
