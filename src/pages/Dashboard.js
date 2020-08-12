import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { verifyTokenAsync, userLogoutAsync } from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";

import { setAuthToken } from './../services/auth';
import { getToDoListService } from './../services/user';

function Dashboard() {

  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { user, token, client } = authObj;
  const [userList, setUserList] = useState([]);

  // handle click event of the logout button
  const handleLogout = () => {
    dispatch(userLogoutAsync());
  }

  // get user list
  const getToDoList = async () => {
    setAuthToken(token);
    const result = await getToDoListService(token, client, user);
    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      return;
    }
    setUserList(result.data);
  }


  // get user list on page load
  useEffect(() => {
    getToDoList();
  }, []);

  return (
    <div>
      Welcome {user}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" /><br /><br />
      <input type="button" onClick={getToDoList} value="Get Data" /><br /><br />
      <b>User List:</b>
      <pre>{JSON.stringify(userList, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;