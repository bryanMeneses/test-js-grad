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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const axios = require('axios');

module.exports = async function organiseMaintainers() {
  try {
    const res = await axios.post(
      'http://ambush-api.inyourarea.co.uk/ambush/intercept',
      {
        url: 'https://api.npms.io/v2/search/suggestions?q=react',
        method: 'GET',
        return_payload: true,
      },
    );

    // Get all names
    let names = [];

    res.data.content.forEach(cur => {
      cur.package.maintainers.forEach(({ username }) => {
        // If it is not in the array, add the name
        if (!names.includes(username)) {
          names.push(username);
        }
      });
    });

    // alphebetize
    names = names.sort((a, b) => a.localeCompare(b));

    // Find all packages each person maintains
    // return [{}, {}, {}, ...]

    const maintainers = names.map(cur => {
      let packageNames = [];

      res.data.content.forEach(j => {
        if (j.package.maintainers.filter(z => z.username === cur).length > 0) {
          packageNames.push(j.package.name);
        }
      });

      packageNames = packageNames.sort((a, b) => a.localeCompare(b));

      return { username: cur, packageNames };
    });

    return maintainers;
  } catch (err) {
    console.log(err.message);
  }
};
