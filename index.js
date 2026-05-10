require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,   
};

app.use(auth(config));

app.get('/', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  res.send(`
    <html>
      <head>
        <title>Auth0 Express Quickstart</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
          a { color: #0066cc; text-decoration: none; margin-right: 1rem; }
          a:hover { text-decoration: underline; }
          .status { padding: 1rem; border-radius: 4px; margin: 1rem 0; }
          .logged-in { background: #d4edda; color: #155724; }
          .logged-out { background: #f8d7da; color: #721c24; }
          .error { background: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <h1>Auth0 Express Quickstart</h1>
        <div class="status ${isAuthenticated ? 'logged-in' : 'logged-out'}">
          ${isAuthenticated ? '✓ You are logged in' : '✗ You are logged out'}
        </div>
        ${req.query.error === 'access_denied' ? '<div class="status error">⚠ Login was cancelled.</div>' : ''}
        <nav>
          ${isAuthenticated
            ? '<a href="/profile">Profile</a> | <a href="/logout">Logout</a>'
            : '<a href="/login">Login</a>'}
        </nav>
      </body>
    </html>
  `);
});

app.get('/profile', requiresAuth(), (req, res) => {
  const user = req.oidc.user;
  res.send(`
    <html>
      <head>
        <title>Profile - Auth0 Express</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
          a { color: #0066cc; text-decoration: none; }
          img { border-radius: 50%; }
          pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        </style>
      </head>
      <body>
        <h1>User Profile</h1>
        <div class="card">
          ${user.picture ? `<img src="${user.picture}" alt="Profile" width="80" />` : ''}
          <h2>${user.name || user.nickname || 'User'}</h2>
          <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        </div>
        <h3>Full User Object</h3>
        <pre>${JSON.stringify(user, null, 2)}</pre>
        <nav>
          <a href="/">← Back to Home</a> | <a href="/logout">Logout</a>
        </nav>
      </body>
    </html>
  `);
});

// ✅ Error handler — must be last, before app.listen, with 4 params
app.use((err, req, res, next) => {
  console.error('Auth error:', err.error, err.error_description);

  if (err.error === 'access_denied') {
    return res.redirect('/?error=access_denied');
  }

  res.status(err.status || 500).send(`
    <html>
      <body>
        <h1>Authentication Error</h1>
        <p>${err.error_description || err.message || 'Something went wrong'}</p>
        <a href="/">← Go Home</a>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});