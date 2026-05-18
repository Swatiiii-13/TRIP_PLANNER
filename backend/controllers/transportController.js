const getTransportOptions = (req, res) => {
  const { destination } = req.params;

  // Mocking realistic transport options based on destination
  const transportOptions = [
    {
      id: "t1",
      provider: "IndiGo",
      type: "Flight",
      departureTime: "08:30 AM",
      arrivalTime: "10:45 AM",
      price: "₹ 5,400"
    },
    {
      id: "t2",
      provider: "Air India",
      type: "Flight",
      departureTime: "02:15 PM",
      arrivalTime: "04:30 PM",
      price: "₹ 6,200"
    },
    {
      id: "t3",
      provider: "Vande Bharat Express",
      type: "Train",
      departureTime: "06:00 AM",
      arrivalTime: "02:00 PM",
      price: "₹ 1,500"
    }
  ];

  res.status(200).json(transportOptions);
};

module.exports = {
  getTransportOptions
};
