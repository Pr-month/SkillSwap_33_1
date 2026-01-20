import { get } from 'http';
get('http://localhost:3000/health', (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', () => process.exit(1));
