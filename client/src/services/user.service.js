import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.VUE_APP_ROOT_API;

class UserService {
  getPublicContent() {
    return axios.get(API_URL);
  }

  getUrls() {
    return axios.get(API_URL + 'urls', { withCredentials: true });
  }

  getShortUrl() {
    return axios.get(API_URL + 'urls/new', { withCredentials: true });//, { headers: authHeader() });
  }

  getUrl(id) {
    return axios.get(API_URL + 'urls/' + id, { withCredentials: true });
  }

  searchDate(id, p1, p2) {
    return axios.get(API_URL + 'urls/' + id + '/search/', {
      params: {
        dates1: p1,
        dates2: p2
      },
      withCredentials: true 
    });
  }

  addUrl(url) {
    return axios
      .post(API_URL + 'urls/new', {
        title: url.title,
        longURL: url.longUrl,
        shortURL: url.shortUrl
      }, {
        withCredentials: true
      });
  }

  editUrl(url, id) {
    return axios
      .put(API_URL + 'urls/' + id, {
        title: url.title,
        longURL: url.longUrl
      }, {
        withCredentials: true
      });
  }
  
  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
