try {
  const res = await fetch('https://google.com');
  console.log('Status:', res.status);
} catch (e) {
  console.error('Fetch failed:', e);
}