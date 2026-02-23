const USERS_KEY = 'auth_users';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const base64Encode = (str) => {
  return btoa(str);
};

const base64Decode = (str) => {
  return atob(str);
};

const generateToken = (id) => {
  const payload = {
    id,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  };
  return base64Encode(JSON.stringify(payload));
};

const verifyToken = (token) => {
  try {
    const payload = JSON.parse(base64Decode(token));
    if (Date.now() > payload.exp) {
      return false;
    }
    return payload;
  } catch {
    return false;
  }
};

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const verifyPassword = async (password, hashedPassword) => {
  const newHash = await hashPassword(password);
  return newHash === hashedPassword;
};

export const signup = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();
  
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = users.find(u => u.email === email.toLowerCase());
  if (userExists) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await hashPassword(password);

  const user = {
    _id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  const token = generateToken(user._id);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ _id: user._id, email: user.email }));

  return {
    _id: user._id,
    email: user.email,
    token
  };
};

export const login = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();
  
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = users.find(u => u.email === email.toLowerCase());
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await verifyPassword(password, user.password);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ _id: user._id, email: user.email }));

  return {
    _id: user._id,
    email: user.email,
    token
  };
};

export const getMe = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  
  if (!token || !userStr) {
    throw new Error('Not authenticated');
  }

  const payload = verifyToken(token);
  if (!payload) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    throw new Error('Token expired');
  }

  return JSON.parse(userStr);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
