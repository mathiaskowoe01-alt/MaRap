const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

async function createUsers() {
  console.log('Creating Admin user...');
  const { data: adminData, error: adminError } = await supabase.auth.signUp({
    email: 'admin@marap.co',
    password: 'adminPassword123!',
  });
  if (adminError) console.error('Admin Error:', adminError.message);
  else console.log('Admin user created/exists:', adminData.user?.email);

  console.log('Creating Client user...');
  const { data: clientData, error: clientError } = await supabase.auth.signUp({
    email: 'client@marap.co',
    password: 'clientPassword123!',
  });
  if (clientError) console.error('Client Error:', clientError.message);
  else console.log('Client user created/exists:', clientData.user?.email);
}

createUsers();
