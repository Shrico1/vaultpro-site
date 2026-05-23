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
          Name:       data.name       || '',
          Email:      data.email      || '',
          Phone:      data.phone      || '',
          Instagram:  data.instagram  || '',
          Experience: data.experience || '',
          Goal:       data.goal       || '',
          Age:        data.age        || '',
          Budget:     data.budget     || '',
          Status:     'New',
          'Applied at': new Date().toISOString(),
        },
      }),
    }
  );

  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (!res.ok) {
    const errText = await res.text();
    return new Response(errText, { status: 500, headers });
  }
  return new Response('OK', { status: 200, headers });
}
