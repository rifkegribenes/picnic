const yelp = require('yelp-fusion');
const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);


exports.getParks = (req, res, next) => {
  console.log('getParks');
  let city = req.params.city;
  console.log(city);
  client.search({
    location: city,
    categories: 'parks'
  }).then(data => {
    const firstResult = data.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
    res.send(prettyJson);
  }).catch(err => {
    console.log(err);
    res.send(err.data);
  })

}
