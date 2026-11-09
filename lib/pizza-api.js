import http from 'k6/http';
import { check, group } from 'k6';
import { BASE_URL, jsonHeaders } from './config.js';

/** Builds a random but valid set of restrictions so each virtual user sends different data. */
export function randomRestrictions() {
  return {
    maxCaloriesPerSlice: 500 + Math.floor(Math.random() * 500),
    mustBeVegetarian: Math.random() < 0.3,
    excludedIngredients: [],
    excludedTools: [],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };
}

export function openHomePage() {
  return group('home page', () => {
    const res = http.get(`${BASE_URL}/`, { tags: { name: 'GET /' } });
    check(res, {
      'home: status is 200': (r) => r.status === 200,
      'home: has page title': (r) => r.body.includes('QuickPizza'),
    });
    return res;
  });
}

export function getRecommendation(restrictions = randomRestrictions()) {
  return group('pizza recommendation', () => {
    const res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
      headers: jsonHeaders,
      tags: { name: 'POST /api/pizza' },
    });

    check(res, {
      'pizza: status is 200': (r) => r.status === 200,
      'pizza: has a name': (r) => !!r.json('pizza.name'),
      'pizza: respects topping limits': (r) => {
        const count = (r.json('pizza.ingredients') || []).length;
        return count >= restrictions.minNumberOfToppings && count <= restrictions.maxNumberOfToppings;
      },
      'pizza: vegetarian when required': (r) => !restrictions.mustBeVegetarian || r.json('vegetarian') === true,
    });
    return res;
  });
}
