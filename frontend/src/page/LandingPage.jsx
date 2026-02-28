import React from "react";
import { Code2, Zap, Shield, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-28 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Master Coding with <span className="text-primary">LeetLab</span>
        </h1>

        <p className="text-gray-300 max-w-2xl text-lg md:text-xl mb-10">
          Write, run, and test your code instantly. Practice real problems,
          track progress, and become interview ready.
        </p>

        <div className="flex gap-6">
          <Link
            to="/problems"
            className="btn btn-primary btn-lg gap-2"
          >
            Start Solving <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/login"
            className="btn btn-outline btn-lg"
          >
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-base-200">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Choose LeetLab?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Code2 className="w-8 h-8 text-primary" />}
            title="Multi Language"
            description="Solve problems in JavaScript, Python, Java and more."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-warning" />}
            title="Instant Execution"
            description="Real-time code execution powered by Judge0 API."
          />
          <FeatureCard
            icon={<Database className="w-8 h-8 text-success" />}
            title="Submission History"
            description="Track all your submissions with memory and time stats."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-error" />}
            title="Secure Auth"
            description="JWT-based authentication with encrypted passwords."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <Step number="1" title="Choose Problem" />
          <Step number="2" title="Write Code" />
          <Step number="3" title="Run & Submit" />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center bg-base-200">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Level Up?
        </h2>

        <p className="text-gray-400 mb-8 text-lg">
          Start solving real-world coding problems today.
        </p>

        <Link to="/signup" className="btn btn-primary btn-lg">
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-base-100 p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
    <div className="mb-5">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Step = ({ number, title }) => (
  <div className="bg-base-200 p-8 rounded-xl">
    <div className="text-primary text-3xl font-bold mb-4">{number}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
  </div>
);

export default LandingPage;