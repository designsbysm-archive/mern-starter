const tokenKey = "appToken";

const get = () => {
  return localStorage.getItem(tokenKey);
};

const remove = () => {
  localStorage.removeItem(tokenKey);
};

const save = token => {
  localStorage.setItem(tokenKey, token);
};

export { get as getToken, remove as removeToken, save as saveToken };
