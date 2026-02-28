import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">

        {/* Social Icons */}
        <div className="flex gap-6 text-2xl">
          <a
           href="https://github.com/rohittrana"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub />
          </a>

          <a
            href="https://x.com/Rohittrana17"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>

          <a
           href="https://www.linkedin.com/in/rohittrana17/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Rohit Rana. Built with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;