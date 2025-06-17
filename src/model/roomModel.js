// roomModel.js
const db = require("../config/db");

// Add Room function
exports.addRoom = (roomData, callback) => {
  const query =
    "INSERT INTO room (room_no, room_type, room_status, room_price) VALUES (?, ?, ?, ?)";
  const values = [
    roomData.room_no,
    roomData.room_type,
    roomData.room_status,
    roomData.room_price,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting room:", err);
      return callback(err, null);
    }
    console.log("Room added successfully.");
    callback(null, result);
  });
};

// Get all rooms function
exports.getAllRooms = (callback) => {
  const query = "SELECT * FROM room";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      return callback(err, null);
    }
    console.log("Rooms fetched successfully.");
    callback(null, results);
  });
};

// Fetch rooms not assigned to any active (not discharged) patient
exports.getVacantRooms = (callback) => {
  const query = `
    SELECT * 
FROM room 
WHERE room_status = 'Available'
AND room_no NOT IN (
  SELECT DISTINCT room_id 
  FROM patient 
  WHERE discharge_status IS NULL OR discharge_status != 'Discharged'
);

  `;
  // slect *
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get room by ID function
exports.getRoomById = (roomId, callback) => {
  const query = "SELECT * FROM room WHERE room_no = ?";

  db.query(query, [roomId], (err, results) => {
    if (err) {
      console.error("Error fetching room by ID:", err);
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(new Error("Room not found"), null);
    }
    console.log("Room fetched successfully.");
    callback(null, results[0]);
  });
};

// Update Room function
exports.updateRoom = (roomId, updatedRoomData, callback) => {
  const query =
    "UPDATE room SET room_no=?, room_type = ?, room_status = ?, room_price = ? WHERE room_no = ?";
  const values = [
    updatedRoomData.room_no,
    updatedRoomData.room_type,
    updatedRoomData.room_status,
    updatedRoomData.room_price,
    roomId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating room:", err);
      return callback(err, null);
    }
    console.log("Room updated successfully.");
    callback(null, result);
  });
};

// Delete Room function
exports.deleteRoom = (roomId, callback) => {
  const query = "DELETE FROM room WHERE room_no = ?";

  db.query(query, [roomId], (err, result) => {
    if (err) {
      console.error("Error deleting room:", err);
      return callback(err, null);
    }
    console.log("Room deleted successfully.");
    callback(null, result);
  });
};
