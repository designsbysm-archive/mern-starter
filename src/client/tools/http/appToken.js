const tokenKey = "appToken";

const getToken = () => {
  return localStorage.getItem(tokenKey);
};

const saveToken = token => {
  localStorage.setItem(tokenKey, token);
};

export { getToken, saveToken };
