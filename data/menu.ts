export type MenuItem = {
  id: string;
  name: string;
  telugu: string;
  image: string;
  price?: string;
};

export type MenuCategory = {
  category: "Rotti" | "Snacks" | "Sweets" | "Powders" | "Special Items";
  subtitle?: string;
  items: MenuItem[];
};

const img = (filename: string) => `/Items_Images/${filename}`;

export const menu: MenuCategory[] = [
  {
    category: "Rotti",
    subtitle: "Fresh rottis made the traditional way.",
    items: [
      { id: "saddha-rotti", name: "Saddha Rotti", telugu: "సద్ద రొట్టి", image: img("Saddha Rotti.png"), price: "₹49" },
      { id: "nuvvula-rotti", name: "Nuvvula Rotti", telugu: "నువ్వుల రొట్టి", image: img("Nuvvula Rotti.png"), price: "₹59" },
      { id: "antukula-rotti", name: "Antukula Rotti", telugu: "అంటుకుల రొట్టి", image: img("Atukula Rotti.png"), price: "₹59" },
      { id: "jonna-rotti", name: "Jonna Rotti", telugu: "జొన్న రొట్టి", image: img("Jonna Rotti.png"), price: "₹59" },
      { id: "korra-rotti", name: "Korra Rotti", telugu: "కొర్ర రొట్టి", image: img("Korra Rotti.png"), price: "₹59" },
      { id: "ragi-rotti", name: "Ragi Rotti", telugu: "రాగి రొట్టి", image: img("Ragi Rotti.jpg"), price: "₹59" },
      { id: "oodalu-rotti-spicy", name: "Oodalu Rotti (Spicy)", telugu: "ఓడలు రొట్టి (కారం)", image: img("Oodalu Rotti (Spicy).png"), price: "₹69" },
      { id: "oodalu-rotti-plain", name: "Oodalu Rotti (Plain)", telugu: "ఓడలు రొట్టి (సాధారణం)", image: img("Oodalu Rotti (Plain).png"), price: "₹69" }
    ]
  },
  {
    category: "Snacks",
    subtitle: "Hot, crispy, and perfect with chai.",
    items: [
      { id: "chekkalu", name: "Chekkalu", telugu: "చెక్కలు", image: img("Chekkalu.png"), price: "₹149" },
      { id: "uddipappu-chekkalu", name: "Uddipappu Chekkalu", telugu: "ఉద్దిపప్పు చెక్కలు", image: img("Uddipappu Chekkalu.png"), price: "₹159" },
      { id: "vaamu-chekkalu", name: "Vaamu Chekkalu", telugu: "వాము చెక్కలు", image: img("Vaamu Chekkalu.png"), price: "₹159" },
      { id: "nippattu", name: "Nippattu", telugu: "నిప్పట్టు", image: img("Nippattu.png"), price: "₹139" },
      { id: "madduru-vada", name: "Madduru Vada", telugu: "మద్దూరు వడ", image: img("Madduru Vada.png"), price: "₹169" },
      { id: "hot-boondi", name: "Hot Boondi", telugu: "హాట్ బూంది", image: img("Hot Boondi.jpg"), price: "₹129" },
      { id: "sabudana-murukulu", name: "Sabudana Murukulu", telugu: "సగ్గుబియ్యం మురుకులు", image: img("Sabudana Murukulu.png"), price: "₹149" },
      { id: "murukulu", name: "Murukulu", telugu: "మురుకులు", image: img("Murukulu.png"), price: "₹149" },
      { id: "janthikalu", name: "Janthikalu", telugu: "జంతికలు", image: img("Janthikalu.png"), price: "₹169" },
      { id: "mixture", name: "Mixture", telugu: "మిక్స్చర్", image: img("Mixture.png"), price: "₹149" },
      { id: "borugulu-masala", name: "Borugulu Masala", telugu: "బొరుగులు మసాలా", image: img("Borugulu Masala.png"), price: "₹79" },
      { id: "nimmakaya-borugulu", name: "Nimmakaya Borugulu", telugu: "నిమ్మకాయ బొరుగులు", image: img("Nimmakaya Borugulu.png"), price: "₹79" },
      { id: "diamond-biscuits", name: "Diamond Biscuits", telugu: "డైమండ్ బిస్కెట్స్", image: img("Diamond Biscuits.png"), price: "₹129" },
      { id: "atukulu", name: "Atukulu", telugu: "అటుకులు", image: img("Atukulu.png"), price: "₹69" }
    ]
  },
  {
    category: "Sweets",
    subtitle: "Festival favourites and everyday comfort sweets.",
    items: [
      { id: "khajalu", name: "Khajalu", telugu: "ఖాజాలు", image: img("Khajalu.png"), price: "₹219" },
      { id: "rava-laddu", name: "Rava Laddu", telugu: "రవ్వ లడ్డూ", image: img("Rava Laddu (Sugar).png"), price: "₹199" },
      { id: "besan-laddu", name: "Besan Laddu", telugu: "బేసన్ లడ్డూ", image: img("Besan Laddu.png"), price: "₹229" },
      { id: "sunnundalu", name: "Sunnundalu", telugu: "సున్నుండలు", image: img("Sunnundalu.png"), price: "₹249" },
      { id: "kajjikayalu", name: "Kajjikayalu", telugu: "కజ్జికాయలు", image: img("Kajjikayalu.png"), price: "₹239" },
      { id: "ariselu", name: "Ariselu", telugu: "అరిసెలు", image: img("Ariselu.png"), price: "₹299" },
      { id: "boorelu", name: "Boorelu", telugu: "బూరెలు", image: img("Purnam Boorelu.png"), price: "₹269" }
    ]
  },
  {
    category: "Powders",
    subtitle: "Home-style podulu for rice, idli, and tiffins.",
    items: [
      { id: "karivepaku-podi", name: "Karivepaku Podi", telugu: "కరివేపాకు పొడి", image: "/products/placeholder-podulu.svg" },
      { id: "idli-karam", name: "Idli Karam", telugu: "ఇడ్లీకారం", image: "/products/placeholder-podulu.svg" },
      { id: "sambar-podi", name: "Sambar Podi", telugu: "సాంబారు పొడి", image: "/products/placeholder-podulu.svg" },
      { id: "pulihora-podi", name: "Pulihora Podi", telugu: "పులిహోర పొడి", image: "/products/placeholder-podulu.svg" }
    ]
  },
  {
    category: "Special Items",
    subtitle: "Limited batches and festive specials.",
    items: [
      { id: "ariselu-special", name: "Ariselu", telugu: "అరిసెలు", image: img("Ariselu.png"), price: "₹299" },
      { id: "janthikalu-special", name: "Janthikalu", telugu: "జంతికలు", image: img("Janthikalu.png"), price: "₹169" },
      { id: "murukulu-special", name: "Murukulu", telugu: "మురుకులు", image: img("Murukulu.png"), price: "₹169" },
      { id: "karam-boondi-special", name: "Karam Boondi", telugu: "కారం బూంది", image: img("Hot Boondi.jpg"), price: "₹149" },
      { id: "mixture-special", name: "Mixture", telugu: "మిక్స్చర్", image: img("Mixture.png"), price: "₹149" }
    ]
  }
];

