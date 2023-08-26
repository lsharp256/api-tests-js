const axios = require('axios');
const { expect } = require('chai');

const URL = 'https://v6.exchangerate-api.com/v6/1fc80820c72b0163bc9c7536/latest/USD';

describe('Exchange Rate API Tests', () => {

  it('should return status 200', async () => {
    const response = await axios.get(URL);
    expect(response.status).to.equal(200);
  });

  it('should have a robust count of currencies', async () => {
    try {
      const response = await axios.get(URL);
      expect(response.data).to.have.property('conversion_rates');

      const currencies = response.data.conversion_rates;

      // Verify the total number of currencies (or that it's over a threshold)
      expect(Object.keys(currencies).length).to.be.at.least(100);

      // Check the presence of some known currencies
      const knownCurrencies = ['USD', 'EUR', 'GBP'];
      knownCurrencies.forEach((currency) => {
        expect(currencies).to.have.property(currency);
      });

    } catch (error) {
      // Handle error and fail the test if needed
      throw new Error('Test failed due to ${error}');
    }
  });

  it('should include GBP rate', async () => {
    const response = await axios.get(URL);
    expect(response.data.conversion_rates).to.have.property('GBP');
  });

  it('should fail for an invalid API key', async () => {
    const invalidURL = 'https://v6.exchangerate-api.com/v6/invalidKey/latest/USD';
    try {
      await axios.get(invalidURL);
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });

  it('should support different base currencies', async () => {
    const responseEUR = await axios.get('https://v6.exchangerate-api.com/v6/1fc80820c72b0163bc9c7536/latest/EUR');
    expect(responseEUR.data.conversion_rates).to.have.property('USD');
  });

  it('should return float conversion rates', async () => {
    const response = await axios.get(URL);
    Object.values(response.data.conversion_rates).forEach(rate => {
      expect(rate).to.be.a('number');
    });

  });
  
});
