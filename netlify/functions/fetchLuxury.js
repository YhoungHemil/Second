const fetch = require('node-fetch');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

exports.handler = async () => {
  try {
    const url = `https://api.unsplash.com/photos/random?query=luxury+property+interior+architecture&orientation=landscape&count=20&client_id=${UNSPLASH_ACCESS_KEY}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch from Unsplash");

    const raw = await response.json();

    const filtered = raw
      .filter(img =>
        img?.urls?.regular &&
        typeof img?.urls?.regular === 'string' &&
        (img.alt_description || img.description)
      )
      .map(img => ({
        image: img.urls.regular,
        title: img.alt_description || "Luxury Property"
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({ results: filtered.slice(0, 10) })
    };
  } catch (error) {
    console.error("FetchLuxury error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch images." })
    };
  }
};
