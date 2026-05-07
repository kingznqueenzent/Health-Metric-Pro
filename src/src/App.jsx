import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1>Health Metric Pro</h1>
      <p>Your UK-focused health and nutrition toolkit.</p>

      <div className="card">
        <h2>Free Tools</h2>

        <ul>
          <li><Link to="/bmi-calculator">BMI Calculator</Link></li>
          <li><Link to="/protein-calculator">Protein Calculator</Link></li>
          <li><Link to="/tdee-calculator">TDEE Calculator</Link></li>
          <li><Link to="/water-intake-calculator">Water Intake Calculator</Link></li>
        </ul>
      </div>

      <div className="card">
        <h2>Free Meal Plan</h2>

        <Link className="button" to="/7-day-meal-plan">
          Get Free 7-Day Meal Plan
        </Link>
      </div>
    </div>
  );
}

function MealPlan() {
  return (
    <div className="container">
      <h1>Your Free 7-Day Meal Plan</h1>

      <p>
        This free plan is designed to help you improve your nutrition habits.
      </p>

      <div className="card">
        <h2>Upgrade to Premium</h2>

        <p>
          Unlock the full 30-Day Premium Meal Plan with grocery lists,
          structured meals, and nutrition guidance.
        </p>

        <a
          className="button"
          href="https://buy.stripe.com/5kQ9AV9dng0UdQlaQ81Jm00"
        >
          Upgrade My Plan
        </a>
      </div>
    </div>
  );
}

function PremiumDownload() {
  return (
    <div className="container">
      <h1>Payment Successful</h1>

      <p>Your 30-Day Premium Meal Plan is ready.</p>

      <a
        className="button"
        href="PASTE_GOOGLE_DRIVE_LINK_HERE"
        target="_blank"
      >
        Open Premium Meal Plan
      </a>
    </div>
  );
}

function SimplePage({ title }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      <p>Calculator coming online.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/7-day-meal-plan" element={<MealPlan />} />
      <Route
        path="/premium-meal-plan-download"
        element={<PremiumDownload />}
      />
      <Route
        path="/bmi-calculator"
        element={<SimplePage title="BMI Calculator" />}
      />
      <Route
        path="/protein-calculator"
        element={<SimplePage title="Protein Calculator" />}
      />
      <Route
        path="/tdee-calculator"
        element={<SimplePage title="TDEE Calculator" />}
      />
      <Route
        path="/water-intake-calculator"
        element={<SimplePage title="Water Intake Calculator" />}
      />
    </Routes>
  );
}
