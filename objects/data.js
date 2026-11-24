import exec from 'k6/execution';

export class Data {
  constructor(data) {
    this.data = data;
  }

  getData() {
    for (const name of this.data) {
      if (name !== 'pizza') {
        exec.test.abort(`Unknown data set '${name}'`);
      }
    }
    return {
      pizza: this.data.includes('pizza') ? this._getPizzaRestrictions() : {},
    };
  }

  _getPizzaRestrictions() {
    return {
      maxCaloriesPerSlice: 1000,
      mustBeVegetarian: false,
      excludedIngredients: [],
      excludedTools: [],
      maxNumberOfToppings: 5,
      minNumberOfToppings: 2,
    };
  }
}
