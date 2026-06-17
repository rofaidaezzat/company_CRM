const baseUrl = 'https://crm-v1-otu8.vercel.app';

async function run() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tenant-owner@elshayeb.com',
        password: 'Password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    const token = loginData.data?.token || loginData.token || (loginData.data && loginData.data.newAccessToken);
    console.log('Logged in successfully. Token retrieved.');

    const testCases = [
      { name: 'No params', params: {} },
      { name: 'Basic page/limit', params: { page: 1, limit: 10 } },
      { name: 'Search param', params: { search: 'Ahmed' } },
      { name: 'Status enum', params: { status: 'FRESH' } },
      { name: 'Status comma-separated', params: { status: 'FRESH,FOLLOW_UP' } },
      { name: 'Priority enum', params: { priority: 'HIGH' } },
      { name: 'Priority comma-separated', params: { priority: 'HIGH,MEDIUM' } },
      { name: 'Source enum', params: { source: 'FACEBOOK' } },
      { name: 'Source comma-separated', params: { source: 'FACEBOOK,WEBSITE' } },
      { name: 'Next follow up preset', params: { next_follow_up_preset: 'TODAY' } },
      { name: 'Next follow up start/end', params: { next_follow_up_start: '2026-05-20', next_follow_up_end: '2026-06-10' } },
      { name: 'Start date/End date', params: { start_date: '2026-05-20', end_date: '2026-06-10' } },
      { name: 'Sort and sortOrder', params: { sort: 'created_at', sortOrder: 'desc' } }
    ];

    for (const tc of testCases) {
      try {
        const urlParams = new URLSearchParams();
        Object.entries(tc.params).forEach(([k, v]) => urlParams.append(k, v));
        const queryString = urlParams.toString();
        const url = `${baseUrl}/api/v1/leads${queryString ? `?${queryString}` : ''}`;
        
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          console.log(`PASS: ${tc.name} -> status: ${res.status}, code: ${data.code}, count: ${data.data ? data.data.length : 'N/A'}`);
        } else {
          console.log(`FAIL: ${tc.name} -> status: ${res.status}, data:`, data);
        }
      } catch (err) {
        console.log(`ERROR: ${tc.name} ->`, err.message);
      }
    }

  } catch (err) {
    console.error('Error during run:', err);
  }
}

run();
