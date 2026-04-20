import http from 'http';

const url = process.argv[2] || 'http://localhost:5178';

http.get(url, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', res.headers);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('BODY_START', body.slice(0, 300));
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('ERROR', err.message);
  process.exit(1);
});
