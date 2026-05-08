import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  initialiseAnalytics,
  trackMealPlanSignup,
  trackPageView,
  trackPremiumDownloadOpen,
  trackPremiumUpgradeClick,
} from "./analytics.js";

const siteUrl = "https://www.healthmetricpro.co.uk";
const stripeUrl = "https://buy.stripe.com/5kQ9AV9dng0UdQlaQ81Jm00";
const premiumDownloadUrl =
  "https://drive.google.com/file/d/1mZBAPvEkQHV5eIqRkRtVpgyYiHkGo_IU/view?usp=drive_link";
const contactEmail = "contact@healthmetricpro.co.uk";

const seoPages = {
  home: {
    title: "Health Metric Pro | UK Health and Nutrition Calculators",
    description:
      "Use free UK-focused BMI, protein, TDEE and water intake calculators, then start a practical 7-day meal plan.",
    path: "/",
  },
  bmi: {
    title: "BMI Calculator | Health Metric Pro",
    description:
      "Calculate your BMI using metric UK units and see a simple adult BMI range guide.",
    path: "/bmi-calculator",
  },
  protein: {
    title: "Protein Calculator | Health Metric Pro",
    description:
      "Estimate your daily protein target from body weight and training goal with a simple UK nutrition calculator.",
    path: "/protein-calculator",
  },
  tdee: {
    title: "TDEE Calculator | Health Metric Pro",
    description:
      "Estimate your maintenance calories, BMR and goal calorie ranges from age, height, weight and activity.",
    path: "/tdee-calculator",
  },
  water: {
    title: "Water Intake Calculator | Health Metric Pro",
    description:
      "Estimate a practical daily hydration target in litres from weight, activity and warm conditions.",
    path: "/water-intake-calculator",
  },
  mealPlan: {
    title: "Free 7-Day Meal Plan | Health Metric Pro",
    description:
      "View a free UK-friendly 7-day meal plan sample and upgrade to the premium meal plan when ready.",
    path: "/7-day-meal-plan",
  },
  premiumDownload: {
    title: "Premium Meal Plan Download | Health Metric Pro",
    description:
      "Open your premium Health Metric Pro meal plan after a successful Stripe payment.",
    path: "/premium-meal-plan-download",
  },
  privacy: {
    title: "Privacy Policy | Health Metric Pro",
    description:
      "Read how Health Metric Pro handles privacy, payment processing, contact data and third-party services.",
    path: "/privacy-policy",
  },
  terms: {
    title: "Terms | Health Metric Pro",
    description:
      "Read the terms for using Health Metric Pro calculators, meal plans, Stripe payments and premium downloads.",
    path: "/terms",
  },
  disclaimer: {
    title: "Disclaimer | Health Metric Pro",
    description:
      "Read the health, nutrition and calculator disclaimer for Health Metric Pro.",
    path: "/disclaimer",
  },
  contact: {
    title: "Contact | Health Metric Pro",
    description:
      "Contact Health Metric Pro about meal plans, premium access or website support.",
    path: "/contact",
  },
};

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

function getCanonicalUrl(path) {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

function getSeoForPath(path) {
  return (
    Object.values(seoPages).find((page) => page.path === path) || {
      title: "Health Metric Pro",
      description:
        "Free UK-focused health calculators and meal plan tools from Health Metric Pro.",
      path,
    }
  );
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function upsertStructuredData(data) {
  let script = document.head.querySelector("#structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function buildStructuredData({ title, description, path }) {
  const canonical = getCanonicalUrl(path);
  const graph = [
    {
      "@type": "WebPage",
      "@id": canonical,
      url: canonical,
      name: title,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
  ];

  if (path === "/") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Health Metric Pro",
        description,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Health Metric Pro",
        url: `${siteUrl}/`,
      },
    );
  }

  if (tools.some((tool) => tool.path === path)) {
    graph.push({
      "@type": "WebApplication",
      name: title,
      description,
      url: canonical,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
      },
    });
  }

  if (path === "/7-day-meal-plan") {
    graph.push({
      "@type": "CreativeWork",
      name: "Free 7-Day Meal Plan",
      description,
      url: canonical,
      inLanguage: "en-GB",
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function Seo({ title, description, path }) {
  useEffect(() => {
    const canonical = getCanonicalUrl(path);

    document.title = title;
    upsertCanonical(canonical);
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Health Metric Pro",
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertStructuredData(buildStructuredData({ title, description, path }));
  }, [description, path, title]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initialiseAnalytics();
  }, []);

  useEffect(() => {
    const seo = getSeoForPath(location.pathname);

    trackPageView({
      path: `${location.pathname}${location.search}`,
      title: seo.title,
      url: `${window.location.origin}${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);

  return null;
}

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
          <NavLink to="/water-intake-calculator">Water</NavLink>
          <NavLink to="/7-day-meal-plan">Meal Plan</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <strong>Health Metric Pro</strong>
          <span>Built for practical UK nutrition planning.</span>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    </>
  );
}

function QuickLinks({ includeTools = false }) {
  return (
    <section className="quick-links" aria-label="Related pages">
      <Link to="/">Home</Link>
      {includeTools
        ? tools.map((tool) => (
            <Link key={tool.path} to={tool.path}>
              {tool.title}
            </Link>
          ))
        : null}
      <Link
        to="/7-day-meal-plan"
        onClick={() =>
          trackMealPlanSignup({ event_label: "quick_link_meal_plan" })
        }
      >
        Free Meal Plan
      </Link>
      <Link to="/premium-meal-plan-download">Premium Download</Link>
    </section>
  );
}

function EmailCapture({
  title = "Get meal plan updates",
  description = "Email capture is ready for a future email service connection.",
}) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    trackMealPlanSignup({ event_label: "email_capture_prepared" });
    setIsSubmitted(true);
  }

  return (
    <section className="email-capture" aria-label="Meal plan email updates">
      <div>
        <p className="eyebrow">Meal plan updates</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <button className="button primary" type="submit">
          Register Interest
        </button>
        {isSubmitted ? (
          <p className="small-note">
            Interest noted for this session. Email delivery will be connected
            when the mailing service is added.
          </p>
        ) : null}
      </form>
    </section>
  );
}

function Home() {
  return (
    <AppShell>
      <Seo {...seoPages.home} />
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">UK-focused health and nutrition tools</p>
          <h1>Health Metric Pro</h1>
          <p className="hero-copy">
            Calculate BMI, protein, calories, and hydration targets, then turn
            the numbers into a simple 7-day meal structure.
          </p>
          <div className="hero-actions">
            <Link
              className="button primary"
              to="/7-day-meal-plan"
              onClick={() =>
                trackMealPlanSignup({ event_label: "hero_start_meal_plan" })
              }
            >
              Start Your Free Meal Plan
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
          <p className="eyebrow">Start your free meal plan</p>
          <h2>Turn your calculator results into a practical next step</h2>
          <p>
            Start with balanced breakfasts, portable lunches, and protein-led
            dinners before upgrading to the full premium plan. Built around
            familiar UK ingredients and realistic expectations.
          </p>
        </div>
        <Link
          className="button primary"
          to="/7-day-meal-plan"
          onClick={() =>
            trackMealPlanSignup({ event_label: "homepage_cta_meal_plan" })
          }
        >
          Start Your Free Meal Plan
        </Link>
      </section>

      <section className="conversion-grid">
        <article>
          <p className="eyebrow">Premium teaser</p>
          <h2>Upgrade when you want structure beyond the sample week</h2>
          <p>
            The premium plan is designed for people who want a clearer 30-day
            rhythm, grocery lists, nutrition guidance, and instant digital
            access after secure Stripe checkout.
          </p>
          <a
            className="button primary"
            href={stripeUrl}
            onClick={() =>
              trackPremiumUpgradeClick({ event_label: "homepage_teaser" })
            }
          >
            View Premium Plan
          </a>
        </article>
        <article>
          <p className="eyebrow">Trust signals</p>
          <h2>Built for realistic UK nutrition planning</h2>
          <ul className="trust-list">
            <li>UK-focused calculators and meal wording</li>
            <li>Secure checkout through Stripe</li>
            <li>Instant digital access to the premium document</li>
            <li>General guidance, not a medical diagnosis</li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}

function CalculatorLayout({ eyebrow, title, intro, children, aside, seo }) {
  return (
    <AppShell>
      {seo ? <Seo {...seo} /> : null}
      <section className="page-hero compact">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="calculator-layout">
        <div className="calculator-panel">{children}</div>
        <aside className="insight-panel">{aside}</aside>
      </section>
      <QuickLinks />
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
      seo={seoPages.bmi}
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
      seo={seoPages.protein}
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
      seo={seoPages.tdee}
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
      seo={seoPages.water}
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
      <Seo {...seoPages.mealPlan} />
      <section className="page-hero">
        <p className="eyebrow">Free nutrition plan</p>
        <h1>7-Day Meal Plan</h1>
        <p>
          A practical sample week built around balanced meals, protein at each
          sitting, and supermarket-friendly UK ingredients.
        </p>
        <a
          className="button primary"
          href={stripeUrl}
          onClick={() =>
            trackPremiumUpgradeClick({ event_label: "meal_plan_hero" })
          }
        >
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
          <h2>Unlock the 30-Day Structured Meal Plan</h2>
          <p>
            Get a mobile-friendly digital plan with grocery lists, simple
            nutrition guidance, and instant access after secure Stripe
            checkout.
          </p>
          <ul className="premium-list">
            <li>30-day structured meal rhythm</li>
            <li>Grocery lists for easier planning</li>
            <li>Nutrition guidance for realistic consistency</li>
            <li>Instant digital access after purchase</li>
          </ul>
        </div>
        <a
          className="button primary"
          href={stripeUrl}
          onClick={() =>
            trackPremiumUpgradeClick({ event_label: "meal_plan_premium_band" })
          }
        >
          Buy Premium Plan
        </a>
      </section>
      <QuickLinks includeTools />
    </AppShell>
  );
}

function PremiumDownload() {
  return (
    <AppShell>
      <Seo {...seoPages.premiumDownload} />
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
            onClick={() =>
              trackPremiumDownloadOpen({ event_label: "premium_download_page" })
            }
          >
            Open Premium Meal Plan
          </a>
          <Link className="button secondary" to="/">
            Back to Tools
          </Link>
        </div>
      </section>
      <QuickLinks includeTools />
    </AppShell>
  );
}

function LegalPage({ seo, eyebrow, title, children }) {
  return (
    <AppShell>
      <Seo {...seo} />
      <section className="legal-page">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="small-note">Last updated: 8 May 2026</p>
        <div className="legal-content">{children}</div>
      </section>
      <QuickLinks includeTools />
    </AppShell>
  );
}

function PrivacyPolicy() {
  return (
    <LegalPage
      seo={seoPages.privacy}
      eyebrow="Privacy"
      title="Privacy Policy"
    >
      <h2>Overview</h2>
      <p>
        Health Metric Pro provides health calculators, meal plan information
        and links to third-party payment and document services. This website
        does not currently use user accounts, a custom backend, file uploads or
        hidden payment verification logic.
      </p>

      <h2>Information You Provide</h2>
      <p>
        Calculator values are processed in your browser and are not submitted
        to Health Metric Pro. If you contact us by email, we use your message
        and email address to respond to your request.
      </p>

      <h2>Payments And Premium Access</h2>
      <p>
        Premium purchases are handled by Stripe through a Stripe Payment Link.
        Stripe may collect payment, billing and fraud-prevention information
        under its own privacy terms. Premium delivery is provided through a
        Google Docs or Google Drive link.
      </p>

      <h2>Cookies And Analytics</h2>
      <p>
        The site is prepared for Google Analytics 4 and Google Ads conversion
        measurement. When configured, these tools may process page views,
        route changes and conversion events such as meal plan starts, premium
        upgrade clicks and premium download opens. Third party services such
        as Stripe, Google or Vercel may also process technical data when you
        open their services or load the website.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </LegalPage>
  );
}

function Terms() {
  return (
    <LegalPage seo={seoPages.terms} eyebrow="Terms" title="Terms">
      <h2>Using The Website</h2>
      <p>
        Health Metric Pro is provided for general information, planning and
        educational use. You are responsible for how you use the calculators,
        meal ideas and download links.
      </p>

      <h2>Calculators And Meal Plans</h2>
      <p>
        Calculator outputs are estimates and may not reflect your personal
        medical, fitness or nutrition needs. Meal plan examples are general and
        should be adjusted for allergies, preferences, medication, pregnancy,
        medical conditions and professional advice.
      </p>

      <h2>Payments</h2>
      <p>
        Premium meal plan purchases use a plain Stripe Payment Link. Health
        Metric Pro does not run popup checkout, custom card handling or custom
        checkout logic on this website.
      </p>

      <h2>Premium Delivery</h2>
      <p>
        The premium download page opens the current Google Docs delivery link.
        Access may depend on the document sharing settings and availability of
        Google services.
      </p>

      <h2>Contact</h2>
      <p>
        For support, contact{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </LegalPage>
  );
}

function Disclaimer() {
  return (
    <LegalPage
      seo={seoPages.disclaimer}
      eyebrow="Health disclaimer"
      title="Disclaimer"
    >
      <h2>No Medical Advice</h2>
      <p>
        Health Metric Pro does not provide medical advice, diagnosis or
        treatment. The website is not a replacement for a GP, registered
        dietitian, nutrition professional or other qualified clinician.
      </p>

      <h2>Estimated Results</h2>
      <p>
        BMI, protein, TDEE and water intake results are estimates. They can be
        affected by age, pregnancy, medication, health conditions, body
        composition, activity patterns and measurement accuracy.
      </p>

      <h2>When To Seek Support</h2>
      <p>
        Speak with a qualified professional before changing diet, activity or
        supplement habits if you have a medical condition, are pregnant or
        breastfeeding, have a history of disordered eating, or have concerns
        about weight, hydration or nutrition.
      </p>
    </LegalPage>
  );
}

function Contact() {
  return (
    <LegalPage seo={seoPages.contact} eyebrow="Contact" title="Contact">
      <h2>Website Support</h2>
      <p>
        For questions about Health Metric Pro, premium meal plan access or site
        support, email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed through Stripe. If you have a payment issue,
        include the email address used at checkout and the approximate purchase
        time so the request can be matched to the Stripe receipt.
      </p>
    </LegalPage>
  );
}

function NotFound() {
  return (
    <AppShell>
      <Seo
        title="Page Not Found | Health Metric Pro"
        description="The requested Health Metric Pro page could not be found."
        path="/404"
      />
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
    <>
      <AnalyticsTracker />
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
