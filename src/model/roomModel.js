const db = require("../config/db");

const Room = {
  getAllRoom: (callback) => {
    const query = `SELECT * FROM Room`;
    db.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }
};
  addRoom: (roomData, callback) => {
    const query = `INSERT INTO Room (room_type, room_status, room_price) VALUES (?, ?, ?)`;
    const values = [roomData.room_type, roomData.room_status, roomData.room_price];

    db.query(query, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
module.exports = Room;
