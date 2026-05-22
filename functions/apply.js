export async function onRequestPost({ request, env }) {
  const data = await request.json();

  const res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/Applications`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name:      data.name      || '',
          Email:     data.email     || '',
          Phone:     data.phone     || '',
          Platforms: data.platforms || '',
          Revenue:   data.revenue   || '',
          Why:       data.why       || '',
          Status:    'New',
          'Applied At': new Date().toISOString(),
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('Airtable error:', err);
    return new Response('Error saving application', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}
