import express from 'express';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  console.error('FIREBASE_API_KEY is not set');
}

const app = express();
app.use(express.json());

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: data.error });
    }
    res.json({ idToken: data.idToken, refreshToken: data.refreshToken, uid: data.localId });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: data.error });
    }
    res.json({ idToken: data.idToken, refreshToken: data.refreshToken, uid: data.localId });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
