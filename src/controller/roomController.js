const Room = require('../model/roomModel');

exports.AddRoomPage = (req, res) => {
  res.render('Room/addRoom');
};

exports.addRoom = (req, res) => {
  const { room_type, room_status, room_price } = req.body;

  const newRoom = {
    room_type,
    room_status,
    room_price
  };

  Room.addRoom(newRoom, (err, result) => {
    if (err) {
      console.error("Failed to insert room:", err);
      return res.status(500).send("Server error while adding room.");
    }
    res.render('Room/roomSuccess'); // You can create this view to show a success message
  });
};
