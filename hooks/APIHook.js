/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import {apiUrl} from '../constants/urlConst';
import {AsyncStorage} from 'react-native';

const fetchGET = async (endpoint = '', params = '', token = '') => {
  const fetchOptions = {
    headers: {
      'x-access-token': token,
    },
  };
  const response = await fetch(apiUrl + endpoint + '/' + params,
      fetchOptions);
  if (!response.ok) {
    throw new Error('fetchGET error: ' + response.status);
  }
  return await response.json();
};

const fetchPOST = async (endpoint = '', data = {}, token = '') => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(apiUrl + endpoint, fetchOptions);
  const json = await response.json();
  console.log(json);
  if (response.status === 400 || response.status === 401) {
    const message = Object.values(json).join();
    throw new Error(message);
  } else if (response.status > 299) {
    throw new Error('fetchPOST error: ' + response.status);
  }
  return json;
};

const fetchPUT = async (endpoint = '', data = {}, token = '') => {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(apiUrl + endpoint, fetchOptions);
  const json = await response.json();
  console.log('apihook', json);
  if (response.status === 400 || response.status === 401) {
    alert('Failed. Contact admin');
    const message = Object.values(json).join();
    throw new Error(message);
  } else if (response.status > 299) {
    throw new Error('fetchPUT error: ' + response.status);
  }
  return json;
};

const getAllMedia = async () => {
  const json = await fetchGET('media/all');
  const result = await Promise.all(json.files.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

const getUserMedia = async (token) => {
  const json = await fetchGET('media/user', '', token);
  const result = await Promise.all(json.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

const getSearchedMedia = async (id) =>{
  const json = await fetchGET('media/user/' + id);
  const result = await Promise.all(json.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

const getFileComment = async (id) => {
  const list = await fetchGET('comments/file/' + id);
  return list;
};

const fetchFormData = async (
  endpoint = '', data = new FormData(), token = '') => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'x-access-token': token,
    },
    body: data,
  };
  const response = await fetch(apiUrl + endpoint, fetchOptions);
  const json = await response.json();
  console.log(json);
  if (response.status === 400 || response.status === 401) {
    const message = Object.values(json).join();
    throw new Error(message);
  } else if (response.status > 299) {
    throw new Error('fetchPOST error: ' + response.status);
  }
  return json;
};

const getUser = async (id) =>{
  try {
    const token = await AsyncStorage.getItem('userToken');
    return await fetchGET('users', id, token);
  } catch (e) {
    console.log(e.message);
  }
};

const getCurrentUser = async () => {
  const userFromStorage = await AsyncStorage.getItem('user');
  const uData = JSON.parse(userFromStorage);
  return uData;
};

const fetchDELETE = async (endpoint = '', params = '', token = '') => {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'x-access-token': token,
    },
  };
  const response = await fetch(apiUrl + endpoint + '/' + params,
      fetchOptions);
  if (!response.ok) {
    throw new Error('fetchDELETE error: ' + response.status);
  }
  return await response.json();
};

const getUserList = async () => {
  try {
    // console.log('api');
    const token = await AsyncStorage.getItem('userToken');
    const json = await fetchGET('users', '', token);
    // console.log('apihook', json);
    return json;
  } catch (e) {
    console.log(e.message);
  }
};


export {getAllMedia,
  getUser, fetchGET, fetchPOST, fetchFormData,
  getUserMedia, fetchDELETE, fetchPUT,
  getSearchedMedia, getUserList,
  getFileComment, getCurrentUser,
};
