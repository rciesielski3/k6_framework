import { randomSleep } from '../../common/utils.js';
import { QuickPizza } from '../../objects/quickpizza.js';

// Small, polite flow against the QuickPizza demo: 6 requests + sleeps.
export function quickpizzaSmoke(data) {
  const quickpizza = new QuickPizza(data.baseUrl);
  const credentials = QuickPizza.newCredentials();

  quickpizza.getQuotes();
  randomSleep(500, 1000);

  quickpizza.register(credentials);
  quickpizza.login(credentials);
  randomSleep(500, 1000);

  quickpizza.getPizza(data.pizza);
  randomSleep(500, 1000);

  quickpizza.getDoughs();
  randomSleep(500, 1000);
}
