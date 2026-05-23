export async function onRequest({ request, env }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const data = await request.json();

    const fields = {};
    if (data.name)       fields.Name       = data.name;
    if (data.phone)      fields.Phone      = data.phone;
    if (data.email)      fields.Email      = data.email;
    if (data.instagram)  fields.Instagram  = data.instagram;
    if (data.experience) fields.Experience = data.experience;
    if (data.goal)       fields.Goal       = data.goal;
    if (data.age)        fields.Age        = data.age;
    if (data.budget)     fields.Budget     = data.budget;

    const isUpdate = !!data.recordId;
    const url = isUpdate
      ? `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/Applications/${data.recordId}`
      : `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/Applications`;

    if (!isUpdate) {
      fields.Status = 'New';
      fields['Applied at'] = new Date().toISOString();
    }

    const res = await fetch(url, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response('Airtable error: ' + err, { status: 500, headers });
    }

    const json = await res.json();
    return new Response(JSON.stringify({ id: json.id }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response('Crash: ' + e.message, { status: 500, headers });
  }
}
