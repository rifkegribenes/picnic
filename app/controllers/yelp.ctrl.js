const yelp = require('yelp-fusion');
const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);


exports.getParks = (req, res, next) => {
  console.log('getParks');
  let city = req.params.city;
  client.search({
    location: city,
    categories: 'parks'
  }).then(data => {
    res.send(data.jsonBody.businesses);
  }).catch(err => {
    console.log(err);
    res.send(err.data);
  })

}
