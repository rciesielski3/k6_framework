import { Requests } from './requests.js';
import { randomString } from '../common/utils.js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Client for the QuickPizza demo API, see
// https://github.com/grafana/quickpizza/blob/main/quickpizza-openapi.yaml
export class QuickPizza extends Requests {
  constructor(url) {
    super(url);
    this.user = 'quickpizza';
    this.token;
  }

  getQuotes() {
    this.get(`${this.url}/api/quotes`, 'GET /api/quotes', 200, ['quotes'], {});
  }

  // Note: the service keeps users per backend instance, so register and login
  // must share cookies (k6 keeps a cookie jar per VU, so this works by default).
  register(credentials) {
    this.post(
      `${this.url}/api/users`,
      JSON.stringify(credentials),
      'POST /api/users',
      201,
      ['id', 'username'],
      { headers: JSON_HEADERS },
    );
  }

  login(credentials) {
    this.post(
      `${this.url}/api/users/token/login`,
      JSON.stringify(credentials),
      'POST /api/users/token/login',
      200,
      ['token'],
      { headers: JSON_HEADERS },
    );
    this.token = this.response.json('token');
  }

  getPizza(restrictions) {
    this.post(
      `${this.url}/api/pizza`,
      JSON.stringify(restrictions),
      'POST /api/pizza',
      200,
      ['pizza', 'calories', 'vegetarian'],
      { headers: this._authHeaders() },
    );
  }

  getDoughs() {
    this.get(`${this.url}/api/doughs`, 'GET /api/doughs', 200, ['doughs'], {
      headers: this._authHeaders(),
    });
  }

  static newCredentials() {
    return { username: `k6_${randomString(10)}`, password: randomString(16) };
  }

  _authHeaders() {
    return { ...JSON_HEADERS, Authorization: `Token ${this.token}` };
  }
}
