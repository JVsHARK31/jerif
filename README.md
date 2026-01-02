# J-erif - Military Verification Service

![J-erif Logo](public/logo.png)

A modern military verification service similar to SheerID, built with Next.js 14, TypeScript, and TailwindCSS. This application allows businesses to verify U.S. military servicemembers and veterans for exclusive discounts and offers.

## 🌟 Features

- **Military Verification** - Verify active duty, retired, and discharged veterans
- **Auto-Fill Form** - Quick form filling from veteran database
- **Admin Dashboard** - Manage campaigns and view verification logs
- **Real-time Verification** - Instant verification against veteran database
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Secure** - Rate limiting and audit logging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/j-erif.git
cd j-erif

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Veterans API URL (for auto-fill feature)
VETERANS_API_URL=http://localhost:8000

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 📁 Project Structure

```
j-erif/
├── public/
│   ├── logo.png           # J-erif logo
│   └── favicon.ico        # Favicon
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── admin/     # Admin API endpoints
│   │   │   ├── session/   # Session management
│   │   │   ├── verify/    # Verification endpoint
│   │   │   └── veterans/  # Veterans data endpoint
│   │   ├── admin/         # Admin dashboard page
│   │   ├── help/          # Help/FAQ page
│   │   ├── privacy/       # Privacy policy page
│   │   ├── verify/        # Verification pages
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── Footer.tsx     # Footer component
│   │   ├── Header.tsx     # Header with navigation
│   │   ├── StepIndicator.tsx
│   │   ├── VerificationForm.tsx
│   │   └── VerificationResult.tsx
│   └── lib/
│       ├── db.ts          # SQLite database layer
│       ├── rateLimit.ts   # Rate limiting utility
│       ├── seed.ts        # Database seeding
│       └── verificationProvider.ts
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json            # Vercel deployment config
```

## 🔗 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/session` | Get verification session |
| POST | `/api/verify` | Submit verification |
| GET | `/api/veterans` | Get veterans for auto-fill |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth` | Admin login |
| GET | `/api/admin/campaigns` | List campaigns |
| POST | `/api/admin/campaigns` | Create campaign |
| GET | `/api/admin/verifications` | List verifications |
| POST | `/api/admin/generate-link` | Generate verification link |

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f0fdfa',
    // ... teal color palette
    900: '#134e4a',
  },
  secondary: {
    // ... gray color palette
  },
}
```

### Campaign Configuration

Create custom campaigns with different form fields and benefits in the admin dashboard or by modifying `src/lib/seed.ts`.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
vercel
```

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🔒 Security

- Rate limiting on all API endpoints
- Audit logging for all verification attempts
- Secure session management
- Input validation and sanitization

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact us at support@j-erif.com.

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
