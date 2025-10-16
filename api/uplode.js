import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const form = new FormData();
  form.append('files/index.html', buffer, {
    filename: 'index.html',
    contentType: 'text/html'
  });

  const response = await fetch(`https://api.vercel.com/v2/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
    },
    body: form
  });

  const data = await response.json();
  res.status(200).json({ url: data.url || null });
}
