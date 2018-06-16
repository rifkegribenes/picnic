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
  })
  .catch((err) => {
    console.log('error at line 16 yelp.ctrl.js');
    return handleError(res, err);
  });

}

const handleError = (res, err) => {
  const error = (JSON.parse(err.response.body));
  return res.status(500).json({message: error.error.description});
}
