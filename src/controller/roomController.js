//roomController.js

const Room = require("../model/roomModel");

exports.AddRoomPage = (req, res) => {
  res.render("Room/addRoom");
};

// Handle Add Room POST
exports.AddRoom = (req, res) => {
  const roomData = {
    room_type: req.body.room_type,
    room_status: req.body.room_status,
    room_price: req.body.room_price,
  };

  Room.addRoom(roomData, (err, result) => {
    if (err) {
      console.error("Error adding room:", err);
      return res.status(500).send("Error adding room.");
    }
    console.log("Room added successfully.");
    res.redirect("/receptionist/view-rooms"); // adjust route if needed
  });
};

//// View all rooms
exports.ViewRooms = (req, res) => {
  Room.getAllRooms((err, rooms) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      return res.status(500).send("Error fetching rooms.");
    }
    res.render("Room/viewRooms", { rooms });
  });
};

// Update Room Page
exports.UpdateRoomPage = (req, res) => {
  const roomId = req.params.id;
  Room.getRoomById(roomId, (err, room) => {
    if (err) {
      console.error("Error fetching room:", err);
      return res.status(500).send("Error fetching room.");
    }
    res.render("Room/updateRoom", { room });
  });
};

// Handle Update Room POST
exports.UpdateRoom = (req, res) => {
  const roomId = req.params.id;
  const updatedRoomData = {
    room_type: req.body.room_type,
    room_status: req.body.room_status,
    room_price: req.body.room_price,
  };

  Room.updateRoom(roomId, updatedRoomData, (err, result) => {
    if (err) {
      console.error("Error updating room:", err);
      return res.status(500).send("Error updating room.");
    }
    console.log("Room updated successfully.");
    res.redirect("/receptionist/view-rooms"); // adjust route if needed
  });
};

// Delete Room Page
exports.DeleteRoomPage = (req, res) => {
  const roomId = req.params.id;
  Room.getRoomById(roomId, (err, room) => {
    if (err) {
      console.error("Error fetching room:", err);
      return res.status(500).send("Error fetching room.");
    }
    res.render("Room/deleteRoom", { room });
  });
};

// Handle Delete Room POST
exports.DeleteRoom = (req, res) => {
  const roomId = req.params.id;

  Room.deleteRoom(roomId, (err, result) => {
    if (err) {
      console.error("Error deleting room:", err);
      return res.status(500).send("Error deleting room.");
    }
    console.log("Room deleted successfully.");
    res.redirect("/receptionist/view-rooms"); // adjust route if needed
  });
};
