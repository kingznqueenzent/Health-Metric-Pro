import React, { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";

const stripeUrl = "https://buy.stripe.com/5kQ9AV9dng0UdQlaQ81Jm00";
const premiumDownloadUrl =
  "https://drive.google.com/file/d/1mZBAPvEkQHV5eIqRkRtVpgyYiHkGo_IU/view?usp=drive_link";

const tools = [
  {
    title: "BMI Calculator",
    path: "/bmi-calculator",
    summary: "Check your body mass index using metric UK units.",
  },
  {
    title: "Protein Calculator",
    path: "/protein-calculator",
    summary: "Estimate daily protein targets for your training goal.",
  },
  {
    title: "TDEE Calculator",
    path: "/tdee-calculator",
    summary: "Estimate daily maintenance calories from your activity.",
  },
  {
    title: "Water Intake Calculator",
    path: "/water-intake-calculator",
    summary: "Plan a practical daily hydration target in litres.",
  },
];

const mealPlan = [
  {
    day: "Monday",
    breakfast: "Greek yoghurt, berries, oats, and chia seeds",
    lunch: "Chicken salad wrap with spinach, peppers, and hummus",
    dinner: "Salmon, new potatoes, broccoli, and lemon yoghurt dressing",
    snack: "Apple slices with peanut butter",
  },
  {
    day: "Tuesday",
    breakfast: "Scrambled eggs on wholemeal toast with tomatoes",
    lunch: "Lentil and vegetable soup with seeded bread",
    dinner: "Turkey chilli with brown rice and mixed salad",
    snack: "Cottage cheese with cucumber sticks",
  },
  {
    day: "Wednesday",
    breakfast: "Protein porridge with banana and cinnamon",
    lunch: "Tuna jacket potato with sweetcorn and side salad",
    dinner: "Chicken stir-fry with noodles and mixed vegetables",
    snack: "Carrot sticks with hummus",
  },
  {
    day: "Thursday",
    breakfast: "Overnight oats with apple, yoghurt, and flaxseed",
    lunch: "Falafel bowl with couscous, salad, and tzatziki",
    dinner: "Lean beef or bean bolognese with wholewheat pasta",
    snack: "Boiled eggs and cherry tomatoes",
  },
  {
    day: "Friday",
    breakfast: "Smoothie with milk, oats, berries, and protein yoghurt",
    lunch: "Chicken, avocado, and salad sandwich on wholegrain bread",
    dinner: "Cod, sweet potato wedges, peas, and tartare-style yoghurt",
    snack: "Mixed nuts and a pear",
  },
  {
    day: "Saturday",
    breakfast: "Mushroom omelette with spinach and toast",
    lunch: "Prawn or tofu rice bowl with cucumber and edamame",
    dinner: "Homemade chicken curry with basmati rice and vegetables",
    snack: "Skyr yoghurt with berries",
  },
  {
    day: "Sunday",
    breakfast: "Wholemeal pancakes with yoghurt and berries",
    lunch: "Roast chicken or chickpea traybake with vegetables",
    dinner: "Vegetable frittata with salad and new potatoes",
    snack: "Protein yoghurt or roasted chickpeas",
  },
];

function clampNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function AppShell({ children }) {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Health Metric Pro home">
          <span className="brand-mark">HMP</span>
          <span>
            <strong>Health Metric Pro</strong>
            <small>UK health calculators</small>
          </span>
        </Link>
        <nav className="top-nav" aria-label="Main navigation">
          <NavLink to="/bmi-calculator">BMI</NavLink>
          <NavLink to="/protein-calculator">Protein</NavLink>
          <NavLink to="/tdee-calculator">TDEE</NavLink>
          <NavLink to="/7-day-meal-plan">Meal Plan</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <strong>Health Metric Pro</strong>
          <span>Built for practical UK nutrition planning.</span>
        </div>
        <Link to="/premium-meal-plan-download">Premium download</Link>
      </footer>
    </>
  );
}

function Home() {
  return (
    <AppShell>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">UK-focused health and nutrition tools</p>
          <h1>Health Metric Pro</h1>
          <p className="hero-copy">
            Calculate BMI, protein, calories, and hydration targets, then turn
            the numbers into a simple 7-day meal structure.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/7-day-meal-plan">
              Get Free Meal Plan
            </Link>
            <Link className="button secondary" to="/bmi-calculator">
              Start With BMI
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Free tools</p>
          <h2>Calculate your daily health metrics</h2>
        </div>
        <div className="tool-grid">
          {tools.map((tool) => (
            <Link className="tool-card" key={tool.path} to={tool.path}>
              <span>{tool.title}</span>
              <p>{tool.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="eyebrow">Free 7-day plan</p>
          <h2>Simple meals with familiar UK ingredients</h2>
          <p>
            Start with balanced breakfasts, portable lunches, and protein-led
            dinners before upgrading to the full premium plan.
          </p>
        </div>
        <Link className="button primary" to="/7-day-meal-plan">
          View Meal Plan
        </Link>
      </section>
    </AppShell>
  );
}

function CalculatorLayout({ eyebrow, title, intro, children, aside }) {
  return (
    <AppShell>
      <section className="page-hero compact">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="calculator-layout">
        <div className="calculator-panel">{children}</div>
        <aside className="insight-panel">{aside}</aside>
      </section>
    </AppShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ResultBox({ label, value, helper }) {
  return (
    <div className="result-box">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <p>{helper}</p> : null}
    </div>
  );
}

function BmiCalculator() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);

  const result = useMemo(() => {
    const metres = clampNumber(height) / 100;
    const kg = clampNumber(weight);
    if (metres <= 0 || kg <= 0) return null;

    const bmi = kg / metres ** 2;
    let category = "Healthy weight";
    let helper = "This sits in the commonly used healthy adult BMI range.";

    if (bmi < 18.5) {
      category = "Underweight range";
      helper = "Consider speaking with a GP or registered dietitian if this is unexpected.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight range";
      helper = "BMI is only one marker, so waist size and health history also matter.";
    } else if (bmi >= 30 && bmi < 40) {
      category = "Obese range";
      helper = "A GP can help assess wider risk and suitable next steps.";
    } else if (bmi >= 40) {
      category = "Severely obese range";
      helper = "Professional support is recommended for a full health assessment.";
    }

    return { bmi, category, helper };
  }, [height, weight]);

  return (
    <CalculatorLayout
      eyebrow="Metric calculator"
      title="BMI Calculator"
      intro="Use centimetres and kilograms to estimate adult body mass index."
      aside={
        <>
          <h2>Adult BMI guide</h2>
          <ul className="check-list">
            <li>Below 18.5: underweight range</li>
            <li>18.5 to 24.9: healthy weight range</li>
            <li>25 to 29.9: overweight range</li>
            <li>30 or above: obese range</li>
          </ul>
          <p className="small-note">
            BMI is a screening tool, not a diagnosis. It can be less accurate
            during pregnancy, for children, or for very muscular adults.
          </p>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Height">
          <div className="input-unit">
            <input
              min="120"
              max="230"
              type="number"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
            <span>cm</span>
          </div>
        </Field>
        <Field label="Weight">
          <div className="input-unit">
            <input
              min="35"
              max="250"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            <span>kg</span>
          </div>
        </Field>
      </div>
      {result ? (
        <ResultBox
          label={result.category}
          value={`${formatNumber(result.bmi, 1)} BMI`}
          helper={result.helper}
        />
      ) : null}
    </CalculatorLayout>
  );
}

function ProteinCalculator() {
  const [weight, setWeight] = useState(75);
  const [goal, setGoal] = useState("active");

  const ranges = {
    general: [0.75, 0.9, "General health"],
    active: [1.2, 1.6, "Active lifestyle"],
    strength: [1.6, 2, "Strength or fat-loss phase"],
  };

  const result = useMemo(() => {
    const kg = clampNumber(weight);
    const [low, high, label] = ranges[goal];
    return {
      label,
      low: kg * low,
      high: kg * high,
      mealsLow: (kg * low) / 4,
      mealsHigh: (kg * high) / 4,
    };
  }, [goal, weight]);

  return (
    <CalculatorLayout
      eyebrow="Nutrition target"
      title="Protein Calculator"
      intro="Estimate a daily protein target based on body weight and training goal."
      aside={
        <>
          <h2>Planning tips</h2>
          <ul className="check-list">
            <li>Spread protein across meals where possible.</li>
            <li>Mix lean meat, fish, eggs, dairy, beans, tofu, and pulses.</li>
            <li>Higher targets are best paired with enough calories and fibre.</li>
          </ul>
          <p className="small-note">
            Adults with kidney disease or specific medical conditions should
            follow advice from their clinician or dietitian.
          </p>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Body weight">
          <div className="input-unit">
            <input
              min="35"
              max="250"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            <span>kg</span>
          </div>
        </Field>
        <Field label="Goal">
          <select value={goal} onChange={(event) => setGoal(event.target.value)}>
            <option value="general">General health</option>
            <option value="active">Active lifestyle</option>
            <option value="strength">Strength or fat-loss phase</option>
          </select>
        </Field>
      </div>
      <ResultBox
        label={result.label}
        value={`${formatNumber(result.low)}-${formatNumber(result.high)} g/day`}
        helper={`That is about ${formatNumber(result.mealsLow)}-${formatNumber(
          result.mealsHigh,
        )} g across four meals or snacks.`}
      />
    </CalculatorLayout>
  );
}

function TdeeCalculator() {
  const [sex, setSex] = useState("female");
  const [age, setAge] = useState(35);
  const [height, setHeight] = useState(168);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(1.375);

  const result = useMemo(() => {
    const kg = clampNumber(weight);
    const cm = clampNumber(height);
    const years = clampNumber(age);
    const base = 10 * kg + 6.25 * cm - 5 * years + (sex === "male" ? 5 : -161);
    const tdee = base * Number(activity);
    return {
      bmr: base,
      tdee,
      fatLoss: tdee - 400,
      muscleGain: tdee + 250,
    };
  }, [activity, age, height, sex, weight]);

  return (
    <CalculatorLayout
      eyebrow="Energy estimate"
      title="TDEE Calculator"
      intro="Estimate maintenance calories using body stats and weekly activity."
      aside={
        <>
          <h2>Using your estimate</h2>
          <ul className="check-list">
            <li>Track your average body weight for 2 to 4 weeks.</li>
            <li>Adjust calories by small steps if progress stalls.</li>
            <li>Keep protein, fibre, sleep, and training consistent.</li>
          </ul>
          <p className="small-note">
            TDEE is an estimate. Real maintenance calories vary with routine,
            digestion, hormones, medication, and tracking accuracy.
          </p>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Sex">
          <select value={sex} onChange={(event) => setSex(event.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </Field>
        <Field label="Age">
          <div className="input-unit">
            <input
              min="18"
              max="90"
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
            <span>years</span>
          </div>
        </Field>
        <Field label="Height">
          <div className="input-unit">
            <input
              min="120"
              max="230"
              type="number"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
            <span>cm</span>
          </div>
        </Field>
        <Field label="Weight">
          <div className="input-unit">
            <input
              min="35"
              max="250"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            <span>kg</span>
          </div>
        </Field>
        <Field label="Activity level">
          <select
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
          >
            <option value="1.2">Desk-based, little exercise</option>
            <option value="1.375">Light activity 1-3 days/week</option>
            <option value="1.55">Moderate training 3-5 days/week</option>
            <option value="1.725">Hard training 6-7 days/week</option>
          </select>
        </Field>
      </div>
      <div className="result-grid">
        <ResultBox
          label="Maintenance"
          value={`${formatNumber(result.tdee)} kcal/day`}
          helper={`Estimated BMR: ${formatNumber(result.bmr)} kcal/day.`}
        />
        <ResultBox
          label="Goal ranges"
          value={`${formatNumber(result.fatLoss)}-${formatNumber(
            result.muscleGain,
          )} kcal/day`}
          helper="Lower end for gradual fat loss, upper end for lean gain."
        />
      </div>
    </CalculatorLayout>
  );
}

function WaterCalculator() {
  const [weight, setWeight] = useState(75);
  const [activityMinutes, setActivityMinutes] = useState(30);
  const [condition, setCondition] = useState(0);

  const result = useMemo(() => {
    const baseMl = clampNumber(weight) * 30;
    const activityMl = clampNumber(activityMinutes) * 12;
    const extraMl = Number(condition);
    const totalMl = baseMl + activityMl + extraMl;
    return {
      litres: totalMl / 1000,
      glasses: totalMl / 250,
      baseLitres: baseMl / 1000,
    };
  }, [activityMinutes, condition, weight]);

  return (
    <CalculatorLayout
      eyebrow="Hydration planner"
      title="Water Intake Calculator"
      intro="Estimate a daily fluid target using weight, activity, and warmer conditions."
      aside={
        <>
          <h2>UK hydration guide</h2>
          <ul className="check-list">
            <li>Aim for pale yellow urine through the day.</li>
            <li>Water, lower-fat milk, tea, and coffee can count.</li>
            <li>Activity, heat, illness, pregnancy, and breastfeeding may increase needs.</li>
          </ul>
          <p className="small-note">
            Follow clinician advice if you have kidney, heart, or fluid-balance
            conditions.
          </p>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Body weight">
          <div className="input-unit">
            <input
              min="35"
              max="250"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            <span>kg</span>
          </div>
        </Field>
        <Field label="Active minutes today">
          <div className="input-unit">
            <input
              min="0"
              max="240"
              type="number"
              value={activityMinutes}
              onChange={(event) => setActivityMinutes(event.target.value)}
            />
            <span>min</span>
          </div>
        </Field>
        <Field label="Conditions">
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          >
            <option value="0">Normal day</option>
            <option value="350">Warm day or heated indoor environment</option>
            <option value="600">Hot day or heavy sweating</option>
          </select>
        </Field>
      </div>
      <ResultBox
        label="Daily fluid target"
        value={`${formatNumber(result.litres, 1)} litres`}
        helper={`About ${formatNumber(
          result.glasses,
          1,
        )} x 250ml glasses. Baseline before activity: ${formatNumber(
          result.baseLitres,
          1,
        )} litres.`}
      />
    </CalculatorLayout>
  );
}

function MealPlan() {
  return (
    <AppShell>
      <section className="page-hero">
        <p className="eyebrow">Free nutrition plan</p>
        <h1>7-Day Meal Plan</h1>
        <p>
          A practical sample week built around balanced meals, protein at each
          sitting, and supermarket-friendly UK ingredients.
        </p>
        <a className="button primary" href={stripeUrl}>
          Upgrade to Premium
        </a>
      </section>

      <section className="meal-grid" aria-label="Sample 7-day meal plan">
        {mealPlan.map((day) => (
          <article className="meal-card" key={day.day}>
            <h2>{day.day}</h2>
            <dl>
              <div>
                <dt>Breakfast</dt>
                <dd>{day.breakfast}</dd>
              </div>
              <div>
                <dt>Lunch</dt>
                <dd>{day.lunch}</dd>
              </div>
              <div>
                <dt>Dinner</dt>
                <dd>{day.dinner}</dd>
              </div>
              <div>
                <dt>Snack</dt>
                <dd>{day.snack}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="premium-band">
        <div>
          <p className="eyebrow">Premium upgrade</p>
          <h2>Unlock the full premium meal plan</h2>
          <p>
            Get the structured download with more meal variety, shopping
            guidance, and a clearer weekly rhythm.
          </p>
        </div>
        <a className="button primary" href={stripeUrl}>
          Buy Premium Plan
        </a>
      </section>
    </AppShell>
  );
}

function PremiumDownload() {
  return (
    <AppShell>
      <section className="success-page">
        <div className="success-mark" aria-hidden="true">
          OK
        </div>
        <p className="eyebrow">Payment successful</p>
        <h1>Your premium meal plan is ready</h1>
        <p>
          Open the premium plan below and keep it available for meal prep,
          shopping, and weekly planning.
        </p>
        <div className="hero-actions centered">
          <a
            className="button primary"
            href={premiumDownloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open Premium Meal Plan
          </a>
          <Link className="button secondary" to="/">
            Back to Tools
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function NotFound() {
  return (
    <AppShell>
      <section className="success-page">
        <p className="eyebrow">Page not found</p>
        <h1>Let's get you back to your tools</h1>
        <Link className="button primary" to="/">
          Go Home
        </Link>
      </section>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bmi-calculator" element={<BmiCalculator />} />
      <Route path="/protein-calculator" element={<ProteinCalculator />} />
      <Route path="/tdee-calculator" element={<TdeeCalculator />} />
      <Route path="/water-intake-calculator" element={<WaterCalculator />} />
      <Route path="/7-day-meal-plan" element={<MealPlan />} />
      <Route
        path="/premium-meal-plan-download"
        element={<PremiumDownload />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
