# LeetLab 🚀

A modern online coding platform that allows users to write, compile, and execute code in multiple programming languages with real-time feedback.

## 🌟 Features

- **Multi-language Support**: Write and execute code in Java, C++, JavaScript, and Python
- **Real-time Code Execution**: Powered by Judge0 API for fast and secure code compilation
- **User Authentication**: Custom-built login/signup system with secure session management
- **Clean UI**: Modern, responsive interface built with React
- **Code Editor**: Syntax highlighting and auto-completion for better coding experience
- **Test Cases**: Run your code against custom input/output test cases
- **Results Dashboard**: View execution time, memory usage, and output results

## 🛠️ Tech Stack

**Frontend:**
- React.js
- HTML5/CSS3
- JavaScript (ES6+)
- Responsive Design

**Backend:**
- Node.js/Express.js (or your backend tech)
- RESTful APIs
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

**External APIs:**
- Judge0 API for code compilation and execution

**Database:**
- MongoDB/PostgreSQL (specify your choice)

## 📁 Project Structure

```
leetlab/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/            # Server application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Judge0 API key (get it from [Judge0](https://rapidapi.com/judge0-official/api/judge0-ce))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohittrana/leetlab.git
   cd leetlab
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JUDGE0_API_KEY=your_judge0_api_key
   JUDGE0_HOST=judge0-ce.p.rapidapi.com
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**
   
   Start backend server:
   ```bash
   cd backend
   npm start
   ```
   
   Start frontend (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎯 How to Use

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Choose Language**: Select from Java, C++, JavaScript, or Python
3. **Write Code**: Use the built-in code editor with syntax highlighting
4. **Add Input**: Provide custom input for your program (optional)
5. **Execute**: Click run to compile and execute your code
6. **View Results**: See output, execution time, and memory usage

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Code Execution
- `POST /api/code/execute` - Submit code for execution
- `GET /api/code/result/:id` - Get execution results

## 🌐 Supported Languages

- **C++** - Fast execution for competitive programming
- **Java** - Object-oriented programming with JVM
- **Python** - Simple syntax, perfect for algorithms
- **JavaScript (Node.js)** - Modern web development language

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit Rana**
- Email: rohitrana2429@gmail.com
- GitHub: [@rohittrana](https://github.com/rohittrana)
- LinkedIn: [Rohit Rana](https://linkedin.com/in/rohit-rana-dev)

## 🙏 Acknowledgments

- [Judge0](https://judge0.com/) for providing the code execution API
- React community for the amazing frontend framework
- Open source contributors who make projects like this possible

---

⭐ Star this repo if you found it helpful!# LeetLab 🚀

A modern online coding platform that allows users to write, compile, and execute code in multiple programming languages with real-time feedback.

## 🌟 Features

- **Multi-language Support**: Write and execute code in Java, C++, JavaScript, and Python
- **Real-time Code Execution**: Powered by Judge0 API for fast and secure code compilation
- **User Authentication**: Custom-built login/signup system with secure session management
- **Clean UI**: Modern, responsive interface built with React
- **Code Editor**: Syntax highlighting and auto-completion for better coding experience
- **Test Cases**: Run your code against custom input/output test cases
- **Results Dashboard**: View execution time, memory usage, and output results

## 🛠️ Tech Stack

**Frontend:**
- React.js
- HTML5/CSS3
- JavaScript (ES6+)
- Responsive Design

**Backend:**
- Node.js/Express.js (or your backend tech)
- RESTful APIs
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

**External APIs:**
- Judge0 API for code compilation and execution

**Database:**
- MongoDB/PostgreSQL (specify your choice)

## 📁 Project Structure

```
leetlab/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/            # Server application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Judge0 API key (get it from [Judge0](https://rapidapi.com/judge0-official/api/judge0-ce))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohittrana/leetlab.git
   cd leetlab
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JUDGE0_API_KEY=your_judge0_api_key
   JUDGE0_HOST=judge0-ce.p.rapidapi.com
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**
   
   Start backend server:
   ```bash
   cd backend
   npm start
   ```
   
   Start frontend (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎯 How to Use

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Choose Language**: Select from Java, C++, JavaScript, or Python
3. **Write Code**: Use the built-in code editor with syntax highlighting
4. **Add Input**: Provide custom input for your program (optional)
5. **Execute**: Click run to compile and execute your code
6. **View Results**: See output, execution time, and memory usage

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Code Execution
- `POST /api/code/execute` - Submit code for execution
- `GET /api/code/result/:id` - Get execution results

## 🌐 Supported Languages

- **C++** - Fast execution for competitive programming
- **Java** - Object-oriented programming with JVM
- **Python** - Simple syntax, perfect for algorithms
- **JavaScript (Node.js)** - Modern web development language

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit Rana**
- Email: rohitrana2429@gmail.com
- GitHub: [@rohittrana](https://github.com/rohittrana)
- LinkedIn: [Rohit Rana](https://linkedin.com/in/rohit-rana-dev)

## 🙏 Acknowledgments

- [Judge0](https://judge0.com/) for providing the code execution API
- React community for the amazing frontend framework
- Open source contributors who make projects like this possible

---

⭐ Star this repo if you found it helpful!
