const http = require('https');

const apiKey = "c679b3296068212e616c61555a6d3674";
const query = "Software-Engineer"; // Use hyphenated title
const geoid = "102713980"; // India

const url = `https://api.scrapingdog.com/linkedinjobs?api_key=${apiKey}&job_title=${query}&geoid=${geoid}`;

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Scrapingdog Response Status:", res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log("Success! Found jobs.");
      console.log("Response Preview:", JSON.stringify(json, null, 2).substring(0, 1000));
    } catch (e) {
      console.log("Failed to parse JSON. Response:", data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});
