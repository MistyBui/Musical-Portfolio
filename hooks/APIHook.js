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

// get all media
const getAllMedia = async () => {
  console.log('getallmedia');
  const json = await fetchGET('media/all');
  const result = await Promise.all(json.files.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

const getMediaByTag = async () => {
  console.log('gettagmedia');
  const json = await fetchGET('tags/musicalportfolio');
  console.log('getmediasjson', json);
  const result = await Promise.all(json.map( async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
}

// get media of each user
const getUserMedia = async (token) => {
  const json = await fetchGET('media/user', '', token);
  const result = await Promise.all(json.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

// get media searched from searchbar
const getSearchedMedia = async (id) =>{
  const json = await fetchGET('media/user/' + id);
  const result = await Promise.all(json.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

// get all comments of a file
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
    alert('You are not allowed to delete!!!');
    throw new Error('fetchDELETE error: ' + response.status);
  }
  return await response.json();
};

// get all users
const getUserList = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const json = await fetchGET('users', '', token);
    return json;
  } catch (e) {
    console.log(e.message);
  }
};

const deleteFile = (item) => {
  fetchDELETE(apiUrl + 'media/' + item.file_id).then((json) => {
    console.log(json);
  });
};

// get like of a file
const getFileLike = async (id) => {
  const list = await fetchGET('favourites/file', id, '');
  return list;
};

// get list of favourites which users made
const getFavourites = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const list = await fetchGET('favourites', '', token);
  return list;
};

// get media which users liked
const getAllFav = async () => {
  const list = await getFavourites();
  const result = await Promise.all(list.map(async (item) => {
    return await fetchGET('media', item.file_id);
  }));
  return result;
};

export {getAllMedia, getMediaByTag,
  getUser, fetchGET, fetchPOST, fetchFormData,
  getUserMedia, fetchDELETE, fetchPUT,
  getSearchedMedia, getUserList,
  getFileComment, getCurrentUser, getFileLike,
  getFavourites, getAllFav, deleteFile,
};
