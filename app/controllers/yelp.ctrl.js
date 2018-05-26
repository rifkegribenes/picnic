const yelp = require('yelp-fusion');
const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);


exports.getParks = (req, res, next) => {
  let city = req.params.city;
  client.search({
    location: city,
    category_filter: 'parks'
  }).then(data => {
    console.log(data.jsonBody.businesses[0].name);
    res.send(data.jsonBody.businesses);
  }).catch(err => {
    console.log(err);
    res.send(err.data);
  })

}
