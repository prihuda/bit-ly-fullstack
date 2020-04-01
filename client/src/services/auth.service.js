import axios from 'axios';

const API_URL = 'http://localhost:3000/users/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      }, {
        withCredentials: true
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    return axios
      .post(API_URL + 'logout',{}, {
        withCredentials: true
      })
      .then(() => {
        localStorage.removeItem('user');
      });
    
  }

  register(user) {
    return axios
      .post(API_URL + 'register', {
        email: user.email,
        password: user.password
      }, {
        withCredentials: true
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }
}

export default new AuthService();
