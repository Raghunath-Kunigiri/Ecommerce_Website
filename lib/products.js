// lib/products.js  ← create this file in your project

export const products = [
  // ROTTI
  { id: "saddha-rotti",    name: "Saddha Rotti",    telugu: "సద్ద రొట్టి",    price: 49,  category: "rotti",   tags: ["daily", "light", "plain"] },
  { id: "nuvvula-rotti",   name: "Nuvvula Rotti",   telugu: "నువ్వుల రొట్టి", price: 59,  category: "rotti",   tags: ["sesame", "healthy"] },
  { id: "ragi-rotti",      name: "Ragi Rotti",      telugu: "రాగి రొట్టి",    price: 59,  category: "rotti",   tags: ["healthy", "calcium"] },
  { id: "jonna-rotti",     name: "Jonna Rotti",     telugu: "జొన్న రొట్టి",   price: 59,  category: "rotti",   tags: ["jowar", "traditional"] },

  // SNACKS
  { id: "chekkalu",        name: "Chekkalu",        telugu: "చెక్కలు",         price: 149, category: "snacks",  tags: ["crispy", "tea-time", "rice-crackers"] },
  { id: "murukulu",        name: "Murukulu",        telugu: "మురుకులు",         price: 149, category: "snacks",  tags: ["crispy", "tea-time"] },
  { id: "mixture",         name: "Mixture",         telugu: "మిక్స్చర్",        price: 149, category: "snacks",  tags: ["spicy", "tea-time", "popular"] },
  { id: "hot-boondi",      name: "Hot Boondi",      telugu: "హాట్ బూంది",      price: 129, category: "snacks",  tags: ["spicy", "hot"] },
  { id: "nippattu",        name: "Nippattu",        telugu: "నిప్పట్టు",        price: 139, category: "snacks",  tags: ["crispy", "Karnataka-style"] },
  { id: "madduru-vada",    name: "Madduru Vada",    telugu: "మద్దూరు వడ",      price: 169, category: "snacks",  tags: ["premium", "crispy"] },

  // SWEETS
  { id: "sunnundalu",      name: "Sunnundalu",      telugu: "సున్నుండలు",       price: 249, category: "sweets",  tags: ["bestseller", "protein", "urad-dal", "festive"] },
  { id: "kajjikayalu",     name: "Kajjikayalu",     telugu: "కజ్జికాయలు",       price: 239, category: "sweets",  tags: ["festive", "Diwali", "fried"] },
  { id: "ariselu",         name: "Ariselu",         telugu: "అరిసెలు",           price: 299, category: "sweets",  tags: ["festive", "Diwali", "jaggery", "traditional"] },
  { id: "besan-laddu",     name: "Besan Laddu",     telugu: "బేసన్ లడ్డూ",      price: 229, category: "sweets",  tags: ["festive", "gifting", "popular"] },
  { id: "rava-laddu-sugar",name: "Rava Laddu",      telugu: "రవ్వ లడ్డూ",       price: 199, category: "sweets",  tags: ["everyday", "gifting"] },
  { id: "purnam-boorelu",  name: "Purnam Boorelu",  telugu: "పూర్ణం బూరెలు",    price: 269, category: "sweets",  tags: ["festive", "coconut", "traditional"] },
  { id: "oats-laddu",      name: "Oats Laddu",      telugu: "ఓట్స్ లడ్డూ",      price: 219, category: "sweets",  tags: ["healthy", "modern"] },

  // POWDERS
  { id: "karivepaku-podi", name: "Karivepaku Podi", telugu: "కరివేపాకు పొడి",   price: 99,  category: "powders", tags: ["curry-leaf", "rice", "daily"] },
  { id: "rasam-podi",      name: "Rasam Podi",      telugu: "రసం పొడి",          price: 119, category: "powders", tags: ["soup", "rice", "daily"] },
  { id: "sambar-podi",     name: "Sambar Podi",     telugu: "సాంబారు పొడి",      price: 119, category: "powders", tags: ["sambar", "idli", "dosa"] },
  { id: "pulihora-podi",   name: "Pulihora Podi",   telugu: "పులిహోర పొడి",      price: 119, category: "powders", tags: ["tamarind-rice", "traditional"] },
  { id: "idli-karam",      name: "Idli Karam",      telugu: "ఇడ్లీకారం",         price: 99,  category: "powders", tags: ["idli", "breakfast", "spice"] },
  // ... add remaining products following same pattern
];

// Helper: build context string for AI
export function buildProductContext() {
  return products.map(p =>
    `${p.name} (${p.telugu}) - ₹${p.price} - Category: ${p.category} - Tags: ${p.tags.join(", ")}`
  ).join("\n");
}
