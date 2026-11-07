/**
 * Mirror of server/src/services/companyTiers.js for the picker.
 * The server is the authority: it clamps difficulty to the tier regardless of
 * what the client sends.
 */
export const COMPANY_TIERS = [
  {
    id: "tier1",
    level: 1,
    label: "Level 1 - Service & early-stage",
    blurb: "Fundamentals first. Easy to medium DSA, no system design.",
    companies: [
      "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini",
      "HCL", "Tech Mahindra", "LTIMindtree", "Early-stage startup",
    ],
  },
  {
    id: "tier2",
    level: 2,
    label: "Level 2 - Product & mid-tier",
    blurb: "Applied medium DSA plus practical design tradeoffs.",
    companies: [
      "General", "Zoho", "Freshworks", "Razorpay", "Swiggy", "Zomato",
      "Paytm", "PhonePe", "Adobe", "Salesforce", "Oracle", "SAP",
      "Cisco", "Intuit", "Walmart Global Tech",
    ],
  },
  {
    id: "tier3",
    level: 3,
    label: "Level 3 - Top product & big tech",
    blurb: "Hard DSA with follow-ups, system design and ambiguous scenarios.",
    companies: [
      "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix",
      "Uber", "Airbnb", "Stripe", "OpenAI", "Nvidia", "LinkedIn",
      "Atlassian", "Databricks", "Goldman Sachs",
    ],
  },
];

export const getTierForCompany = (company = "") => {
  const key = String(company).trim().toLowerCase();

  return (
    COMPANY_TIERS.find((tier) =>
      tier.companies.some((name) => name.toLowerCase() === key)
    ) || COMPANY_TIERS[1]
  );
};
