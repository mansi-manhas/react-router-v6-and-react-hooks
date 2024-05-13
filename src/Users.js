import React from "react";

import { Routes, Route, Link } from "react-router-dom";

import DynamicRoutingUserProfile from "./DynamicRoutingUserProfile";

const Users = () => {
  return (
    <div>
      <h1>Users</h1>
      <nav>
        <ul>
          <li>
            <Link to="1">User 1</Link>
          </li>
          <li>
            <Link to="2">User 2</Link>
          </li>
          <li>
            <Link to="3">User 3</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path=":id" element={<DynamicRoutingUserProfile />} />
      </Routes>
    </div>
  );
};

export default Users;
