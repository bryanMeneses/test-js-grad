/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

module.exports = async function oldestPackageName() {
  const axios = require('axios');

  try {
    const res = await axios.post(
      'http://ambush-api.inyourarea.co.uk/ambush/intercept',
      {
        url: 'https://api.npms.io/v2/search/suggestions?q=react',
        method: 'GET',
        return_payload: true,
      },
    );

    // Sort from oldest to most recent
    const sortedByDate = res.data.content.sort(
      (a, b) => new Date(a.package.date) - new Date(b.package.date),
    );

    // Get the first one
    const name = sortedByDate[0].package.name;

    return name;
  } catch (err) {
    console.log(err.message);
  }
};
