x = process.argv.push('--story', './tiny-tines-mock');
const axios = require('axios');
jest.mock('axios');
const actionStory = require('./app');
const resolveString = require('./app');

it('runs the actionStory', async () => {
    const mock = jest.spyOn(axios, 'get');
    let action = actionStory;
    axios.get.mockResolvedValue({
        location: {
            city: 'Dublin',
            country: 'Ireland'
        }
      });

      expect(mock).toHaveBeenCalledWith('http://free.ipwhois.io/json/', {});

});

it('returns the resolved string', async () => {
    const str = await resolveString('{{location.city}} is the capital of {{location.country}}',
    {
        location: {
            city: 'Dublin',
            country: 'Ireland'
        }
    });
    expect(str).toEqual('Dublin is the capital of Ireland');  // Make an assertion on the result
});