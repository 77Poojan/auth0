require('dotenv').config();
const express  = require('express');
const path     = require('path');
const { auth, requiresAuth } = require('express-openid-connect');

const app  = express();
const port = process.env.PORT || 3000;

// ── Template engine ──────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static assets ────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth0 ────────────────────────────────────
app.use(auth({
  authRequired: false,
  auth0Logout:  true,
  secret:       process.env.SECRET,
  baseURL:      process.env.BASE_URL,
  clientID:     process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
}));

// ── Routes ───────────────────────────────────
app.get('/', (req, res) => {
  res.redirect(req.oidc.isAuthenticated() ? '/profile' : '/login');
});

app.get('/login', (req, res) => {
  if (req.oidc.isAuthenticated()) return res.redirect('/profile');
  res.render('login', {
    error:            req.query.error || null,
    error_description: req.query.error_description || null,
  });
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.render('profile', { user: req.oidc.user });
});

app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: `${process.env.BASE_URL}/logged-out` });
});

app.get('/logged-out', (req, res) => {
  res.render('logout');
});

// ── Error handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Auth Error]', err.error, err.error_description);
  if (err.error === 'access_denied') {
    return res.redirect('/login?error=access_denied');
  }
  res.status(err.status || 500).render('error', {
    message: err.error_description || err.message || 'Something went wrong.',
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));