# Auth0 Express + EJS Quickstart

A clean Node.js authentication starter using [Auth0](https://auth0.com), Express, and EJS templates. Includes login, profile, logout, and error pages with a polished UI out of the box.

---

## Preview

| Page | Route | Access |
|---|---|---|
| Login | `/login` | Public |
| Profile | `/profile` | Protected |
| Logout | `/logged-out` | Public |
| Error | automatic | On auth failure |

---

## Tech Stack

- **Node.js** + **Express** — server
- **express-openid-connect** — Auth0 SDK
- **EJS** — server-side templates
- **Auth0** — identity provider

---

## Project Structure

```
├── index.js                  # Express app entry point
├── .env                      # Environment variables (never commit)
├── .env.example              # Example env file
├── views/
│   ├── login.ejs             # Sign in page
│   ├── profile.ejs           # Protected profile page
│   ├── logout.ejs            # Signed out confirmation
│   └── error.ejs             # Auth error fallback
└── public/
    ├── css/
    │   └── auth.css          # Shared styles for all pages
    └── js/
        └── login.js          # Client-side form validation
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your Auth0 application

1. Go to [Auth0 Dashboard](https://manage.auth0.com) → **Applications** → **Create Application**
2. Choose **Regular Web Application**
3. Under **Settings**, set:
   - **Allowed Callback URLs** → `http://localhost:3000/callback`
   - **Allowed Logout URLs** → `http://localhost:3000`
   - **Allowed Web Origins** → `http://localhost:3000`
4. Save changes

### 4. Configure environment variables

Copy the example file and fill in your Auth0 credentials:

```bash
cp .env.example .env
```

```env
SECRET=a-long-random-secret-string-at-least-32-chars
BASE_URL=http://localhost:3000
CLIENT_ID=your_auth0_client_id
ISSUER_BASE_URL=https://your-tenant.auth0.com
PORT=3000
NODE_ENV=development
```

> Find `CLIENT_ID` and `ISSUER_BASE_URL` in your Auth0 Application settings.

### 5. Run the app

```bash
node index.js
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `SECRET` | Long random string for session encryption | `openssl rand -hex 32` |
| `BASE_URL` | Your app's base URL | `http://localhost:3000` |
| `CLIENT_ID` | Auth0 Application Client ID | From Auth0 dashboard |
| `ISSUER_BASE_URL` | Auth0 tenant URL | `https://your-tenant.auth0.com` |
| `PORT` | Port to run the server on | `3000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |

---

## How It Works

### Auth flow

```
User visits /         →  redirects to /login or /profile
User visits /login    →  renders login.ejs (public)
User clicks Sign in   →  redirects to Auth0 Universal Login
Auth0 authenticates   →  redirects back to /callback (handled by SDK)
SDK validates token   →  req.oidc.user is now available
User visits /profile  →  renders profile.ejs with user data (protected)
User clicks Sign out  →  Auth0 clears session → /logged-out
```

### EJS + Express connection

```javascript
// index.js tells Express where templates live
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes pass data into templates
res.render('profile', { user: req.oidc.user });
```

```html
<!-- profile.ejs receives and renders the data -->
<h1><%= user.name %></h1>
<p><%= user.email %></p>
```

---

## Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Redirects to `/profile` or `/login` |
| `GET` | `/login` | Renders login page |
| `GET` | `/callback` | Handled by Auth0 SDK |
| `GET` | `/profile` | Protected — requires auth |
| `GET` | `/logout` | Triggers Auth0 logout |
| `GET` | `/logged-out` | Post-logout confirmation page |

---

## Deploying to Production

1. Set `NODE_ENV=production` in your environment
2. Update Auth0 dashboard with your production URLs:
   - **Allowed Callback URLs** → `https://yourdomain.com/callback`
   - **Allowed Logout URLs** → `https://yourdomain.com`
3. Update `BASE_URL` in your environment to your production URL
4. The `response_mode` will automatically revert to the secure `form_post` default in production

---

## .env.example

Create this file in your repo root:

```env
SECRET=
BASE_URL=http://localhost:3000
CLIENT_ID=
ISSUER_BASE_URL=
PORT=3000
NODE_ENV=development
```

> **Never commit your `.env` file.** Make sure `.env` is in your `.gitignore`.

---

## .gitignore

```
node_modules/
.env
```

---

## License

MIT