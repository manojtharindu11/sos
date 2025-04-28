import React from "react";

function AllPlayers({ activeUsers }) {
  return (
    <div>
      <h1>Active Players List</h1>
      {activeUsers.length > 0 ? (
        activeUsers.map((user) => (
          <p key={user.socketId}>{user.username}</p> // 🔥 Don't forget 'key'!
        ))
      ) : (
        <p>No active players found!</p>
      )}
    </div>
  );
}

export default AllPlayers;
