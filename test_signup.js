const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const url = `${envVars.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test' + Date.now() + '@example.com',
    password: 'Password123!'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
