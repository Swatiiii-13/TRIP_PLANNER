const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch Hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Verify availability
    if (hotel.availableRooms <= 0) {
      return res.status(400).json({ message: 'No rooms available' });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Calculate totalCost
    const pricePerNight = hotel.currentPrice;
    const totalCost = pricePerNight * nights;

    // Create Booking
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalCost,
      status: 'confirmed'
    });

    // Decrement availableRooms
    hotel.availableRooms -= 1;
    await hotel.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
};
