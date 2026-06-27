import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const URL = envFile.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)"?/)[1];
const KEY = envFile.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)"?/)[1];

async function createUser(email, password) {
  const res = await fetch(`${URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true
    })
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.msg || JSON.stringify(data));
  }
  return data;
}

async function main() {
  const adminEmail = 'admin@datacheck.ai';
  const adminPass = 'Admin$2026Secure' + Math.floor(Math.random() * 1000);
  
  try {
    await createUser(adminEmail, adminPass);
    console.log(`\n✅ CUENTA ADMIN CREADA`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPass}`);
  } catch (aErr) {
    console.error("Admin creation failed:", aErr.message);
  }

  const auditorEmail = 'auditor@datacheck.ai';
  const auditorPass = 'Auditor$2026Secure' + Math.floor(Math.random() * 1000);
  
  try {
    await createUser(auditorEmail, auditorPass);
    console.log(`\n✅ CUENTA AUDITOR CREADA`);
    console.log(`Email: ${auditorEmail}`);
    console.log(`Password: ${auditorPass}`);
  } catch (auErr) {
    console.error("Auditor creation failed:", auErr.message);
  }
}

main();
