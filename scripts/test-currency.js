async function test() {
  try {
    const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/IDR");
    const rateData = await rateRes.json();
    console.log("Rates:", Object.keys(rateData.rates).length);
    console.log("USD:", rateData.rates.USD);
  } catch (err) {
    console.error(err);
  }
}

test();
