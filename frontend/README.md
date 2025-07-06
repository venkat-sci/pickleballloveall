# 🎾 Pickleballloveall - Tournament Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **The ultimate platform for pickleball tournament management and player development**

Pickleballloveall is a comprehensive, modern web application designed to streamline pickleball tournament organization and enhance the player experience. Built with React, TypeScript, and Tailwind CSS, it offers a beautiful, responsive interface with powerful features for both tournament organizers and players.

## 🌟 Features

### 🏆 Tournament Management

- **Create & Manage Tournaments**: Full tournament lifecycle management
- **Multiple Formats**: Support for singles, doubles, and mixed tournaments
- **Bracket Systems**: Knockout, round-robin, and Swiss tournament formats
- **Real-time Scoring**: Live score updates and match tracking
- **Player Registration**: Streamlined sign-up process with waitlist management
- **Court Scheduling**: Multi-court scheduling with availability tracking

### 👥 Player Experience

- **Player Profiles**: Comprehensive player statistics and ratings
- **Match History**: Detailed match records and performance analytics
- **Tournament Discovery**: Browse and join upcoming tournaments
- **Real-time Updates**: Live notifications for matches and tournaments
- **Rating System**: Advanced player rating and ranking system
- **Community Features**: Connect with other players and build networks

### 📊 Analytics & Reporting

- **Performance Metrics**: Detailed statistics and analytics
- **Tournament Reports**: Comprehensive tournament summaries
- **Player Rankings**: Dynamic leaderboards and rankings
- **Export Capabilities**: Data export in multiple formats (CSV, PDF, Excel)
- **Custom Analytics**: Advanced reporting for organizers

### 🎨 User Interface

- **Modern Design**: Clean, intuitive interface with Apple-level aesthetics
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme customization options
- **Accessibility**: WCAG compliant design
- **Smooth Animations**: Framer Motion powered interactions
- **Progressive Web App**: PWA capabilities for mobile experience

### 🔐 Security & Privacy

- **Secure Authentication**: JWT-based authentication system
- **Role-based Access**: Player, organizer, and admin roles
- **Data Protection**: GDPR compliant privacy controls
- **Secure Payments**: Integrated payment processing
- **API Security**: Rate limiting and security headers

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/pickleballloveall.git
   cd pickleballloveall
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
pickleballloveall/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components
│   │   ├── matches/      # Match-related components
│   │   ├── tournaments/  # Tournament components
│   │   └── ui/           # Base UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── About.tsx     # About page
│   │   ├── Contact.tsx   # Contact page
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Help.tsx      # Help center
│   │   ├── Home.tsx      # Landing page
│   │   ├── Matches.tsx   # Matches management
│   │   ├── Players.tsx   # Player management
│   │   ├── Pricing.tsx   # Pricing page
│   │   ├── Privacy.tsx   # Privacy policy
│   │   ├── Profile.tsx   # User profile
│   │   ├── Terms.tsx     # Terms of service
│   │   └── Tournaments.tsx # Tournament management
│   ├── services/         # API services
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.0.3** - Animation library
- **React Router 6.22.0** - Client-side routing

### State Management

- **Zustand 4.5.0** - Lightweight state management
- **React Hot Toast 2.4.1** - Toast notifications

### UI Components

- **Lucide React 0.344.0** - Beautiful icon library
- **Date-fns 3.3.1** - Date manipulation utilities

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎯 User Roles & Permissions

### 🎾 Player

- Join tournaments
- View match schedules
- Update profile and preferences
- Track personal statistics
- Connect with other players

### 🏅 Organizer

- Create and manage tournaments
- Set up brackets and scheduling
- Manage player registrations
- Update scores and results
- Generate reports and analytics

### 👑 Admin

- Platform administration
- User management
- System configuration
- Analytics and reporting

## 📱 Pages & Features

### 🏠 Public Pages

- **Landing Page** - Hero section, features, testimonials, pricing overview
- **Pricing** - Detailed pricing plans (Free vs Pro)
- **About** - Company information, team, mission, values
- **Contact** - Contact forms, support information, office locations
- **Help Center** - FAQs, tutorials, documentation
- **Privacy Policy** - Data protection and privacy information
- **Terms of Service** - Legal terms and conditions

### 🔐 Authentication

- **Login** - User authentication with test credentials
- **Register** - Account creation for players and organizers
- **Password Reset** - Secure password recovery

### 📊 Dashboard & Management

- **Dashboard** - Overview of tournaments, matches, and statistics
- **Tournaments** - Browse, create, and manage tournaments
- **Matches** - Match scheduling, scoring, and results
- **Players** - Player profiles, rankings, and statistics
- **Profile** - User settings, preferences, and account management

## 💰 Pricing Plans

### 🆓 Free Plan

- Create up to **5 tournaments**
- Basic tournament management
- Player registration system
- Simple bracket generation
- Email notifications
- Community support
- Mobile app access
- Basic statistics

### 🚀 Pro Plan ($29/month or $290/year)

- **Unlimited tournaments**
- Advanced tournament management
- Custom tournament formats
- Advanced bracket systems
- Real-time scoring
- Priority support
- Custom branding
- Advanced analytics
- Payment processing
- Multi-court scheduling
- Automated notifications
- Export capabilities
- API access
- White-label options

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:

- Custom color palette (green and blue gradients)
- Custom animations (fade-in, slide-up, scale-in)
- Responsive breakpoints
- Custom spacing system

## 🧪 Testing

### Test Credentials

For development and testing purposes:

**Player Account:**

- Email: `player@test.com`
- Password: `password123`

**Organizer Account:**

- Email: `organizer@test.com`
- Password: `password123`

### Running Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write clean, readable code
- Add comments for complex logic
- Ensure responsive design
- Test your changes thoroughly

## 📝 API Documentation

### Authentication Endpoints

```typescript
POST / api / auth / login;
POST / api / auth / register;
POST / api / auth / logout;
POST / api / auth / forgot - password;
POST / api / auth / reset - password;
```

### Tournament Endpoints

```typescript
GET    /api/tournaments
POST   /api/tournaments
GET    /api/tournaments/:id
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
POST   /api/tournaments/:id/join
DELETE /api/tournaments/:id/leave
```

### Match Endpoints

```typescript
GET /api/matches
GET /api/matches/:id
PUT /api/matches/:id/score
PUT /api/matches/:id/status
```

### Player Endpoints

```typescript
GET /api/players
GET /api/players/:id
PUT /api/players/:id
GET /api/players/:id/stats
```

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Validation**: Input validation and sanitization
- **HTTPS**: SSL/TLS encryption in production
- **CORS**: Configured for security
- **Rate Limiting**: API rate limiting
- **XSS Protection**: Cross-site scripting prevention

## 📊 Performance

- **Lighthouse Score**: 95+ performance score
- **Bundle Size**: Optimized with code splitting
- **Caching**: Efficient caching strategies
- **Lazy Loading**: Component and route lazy loading
- **Image Optimization**: Responsive images with proper formats

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch devices
- **PWA Features**: Progressive Web App capabilities
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Native app feel

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- **AuthStore**: User authentication and session management
- **TournamentStore**: Tournament data and operations
- **MatchStore**: Match data and real-time updates
- **PlayerStore**: Player information and statistics

## 🎨 Design System

### Colors

- **Primary**: Green (#22c55e)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: Fira Code

### Components

- **Buttons**: Multiple variants and sizes
- **Cards**: Consistent card design
- **Forms**: Accessible form components
- **Modals**: Animated modal dialogs
- **Badges**: Status and category badges

## 📈 Analytics

The platform includes comprehensive analytics:

- **User Engagement**: Page views, session duration
- **Tournament Metrics**: Participation rates, completion rates
- **Player Statistics**: Performance tracking, rating changes
- **Platform Usage**: Feature adoption, user flows

## 🔮 Future Roadmap

### Planned Features

- [ ] **Mobile App**: Native iOS and Android apps
- [ ] **Live Streaming**: Tournament live streaming integration
- [ ] **AI Coaching**: AI-powered coaching recommendations
- [ ] **Social Features**: Enhanced social networking
- [ ] **Marketplace**: Equipment and merchandise marketplace
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Tournament Templates**: Pre-built tournament formats

### Technical Improvements

- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Offline Support**: Enhanced PWA capabilities
- [ ] **Performance**: Further optimization
- [ ] **Accessibility**: Enhanced accessibility features
- [ ] **Testing**: Comprehensive test coverage

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline documentation
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@pickleballloveall.com

### Community

- **Discord**: Join our Discord community
- **Twitter**: Follow @PickleballloveallApp
- **Newsletter**: Subscribe for updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Framer Motion** - For smooth animations
- **Vite** - For the fast build tool
- **TypeScript** - For type safety
- **Pickleball Community** - For inspiration and feedback

---

<div align="center">

**Built with ❤️ for the pickleball community**

[Website](https://pickleballloveall.com) • [Documentation](https://docs.pickleballloveall.com) • [Support](mailto:support@pickleballloveall.com)

</div>
