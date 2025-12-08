# CodeSync - Code Together Live

A real-time collaborative code editor that enables developers to code together with live synchronization, AI assistance, and seamless collaboration features.

## 🚀 Features

- **Live Sync Editing** - Real-time code synchronization across multiple users
- **AI Code Assistance** - Intelligent code suggestions and assistance powered by AI
- **Real-time Collaboration** - Work together with your team in real-time
- **Modern UI/UX** - Built with Material-UI for a beautiful and responsive interface
- **Authentication System** - Secure user authentication and profile management
- **Dark/Light Theme** - Toggle between themes for comfortable coding

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Code Editor**: Monaco Editor
- **Styling**: Emotion + Styled Components
- **HTTP Client**: Axios
- **Authentication**: JWT-based auth system

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codesync-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components and routing
├── redux/              # Redux store and slices
├── utils/              # Utility functions and helpers
├── layout/             # Layout components
├── context/            # React context providers
├── assets/             # Static assets
├── theme.js            # Material-UI theme configuration
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🔐 Authentication

The application includes a complete authentication system with:
- User registration and login
- JWT token management
- Protected routes
- User profile management

## 🎨 Theming

CodeSync supports both light and dark themes that can be toggled dynamically. The theme system is built on Material-UI's theming capabilities with custom color palettes and component styling.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**CodeSync** - Where coding meets collaboration! 🚀
