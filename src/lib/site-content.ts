/**
 * Editable site copy — FAQs, delivery info, testimonials and trust points.
 * Everything here is plain data so it can be updated without touching layout.
 */

export const faqs: { q: string; a: string }[] = [
  {
    q: "How do I place an order?",
    a: "Browse the shop, choose your size or pack, add it to your cart and check out. If you'd rather talk it through, tap the WhatsApp button on any product and we'll take it from there.",
  },
  {
    q: "Do you deliver?",
    a: "Yes. We deliver within Nairobi and arrange countrywide courier for orders outside the city. Share your location at checkout and we'll confirm the details before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery timelines are confirmed when we call you about your order. Nairobi deliveries are usually quickest; upcountry orders go through a courier partner.",
  },
  {
    q: "Can I order through WhatsApp?",
    a: "Absolutely. Every product page has an Order via WhatsApp button that opens a chat with the product and size already filled in.",
  },
  {
    q: "What payment methods are available?",
    a: "We accept M-Pesa, card and pay-on-delivery. Our team confirms the payment details with you when your order is placed.",
  },
  {
    q: "Can I return a product?",
    a: "If something arrives damaged, incorrect or unopened and unsuitable, contact us as soon as you receive it and we'll arrange a replacement or refund.",
  },
  {
    q: "How do I choose the right product?",
    a: "Tell us about your fabrics, your machine or the room you're caring for and we'll recommend something. Message us on WhatsApp — advice is free.",
  },
];

export const deliveryInfo = {
  areas: "Nairobi and surrounding areas, with countrywide courier on request.",
  timelines: "Confirmed with you when your order is placed.",
  charges: "Calculated at checkout based on your delivery choice.",
};

/**
 * Placeholder testimonials. Replace `quote`, `name` and `place` with real
 * customer feedback before publishing — these are clearly marked as samples.
 */
export const testimonials: { quote: string; name: string; place: string }[] = [
  {
    quote: "Sample review — replace with a real customer comment about their order.",
    name: "Customer name",
    place: "Location",
  },
  {
    quote: "Sample review — replace with a real customer comment about delivery or service.",
    name: "Customer name",
    place: "Location",
  },
  {
    quote: "Sample review — replace with a real customer comment about a favourite product.",
    name: "Customer name",
    place: "Location",
  },
];

export const policies: Record<string, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "We only collect the details we need to process and deliver your order, and we never sell them.",
    sections: [
      {
        h: "What we collect",
        p: "Your name, phone number, email address and delivery location, plus any notes you add to an order.",
      },
      {
        h: "How we use it",
        p: "To confirm your order, arrange delivery and contact you if anything needs clarifying.",
      },
      {
        h: "Your choices",
        p: "Write to us any time and we'll update or delete the details we hold for you.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "The basics of ordering from Scentlyn Home Essentials.",
    sections: [
      {
        h: "Orders",
        p: "Placing an order is a request to buy. We confirm availability and the final total with you before dispatch.",
      },
      {
        h: "Pricing",
        p: "Prices are shown in Kenyan shillings and may change. The price confirmed with you at order time is the price you pay.",
      },
      {
        h: "Products",
        p: "Always follow the manufacturer's instructions on the pack. Keep cleaning products away from children and pets.",
      },
    ],
  },
  delivery: {
    title: "Delivery Policy",
    intro: "How your order reaches you.",
    sections: [
      { h: "Where we deliver", p: deliveryInfo.areas },
      { h: "Timelines", p: deliveryInfo.timelines },
      { h: "Charges", p: deliveryInfo.charges },
    ],
  },
  returns: {
    title: "Returns Policy",
    intro: "If something isn't right, tell us early and we'll sort it out.",
    sections: [
      {
        h: "Damaged or incorrect items",
        p: "Contact us on the day you receive your order and we'll arrange a replacement or refund.",
      },
      {
        h: "Unopened items",
        p: "Unopened products in their original packaging can be returned by arrangement.",
      },
      {
        h: "How to start a return",
        p: "Message us on WhatsApp or email with your order details and a photo where relevant.",
      },
    ],
  },
};

export const policyLinks = [
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "delivery", label: "Delivery Policy" },
  { slug: "returns", label: "Returns Policy" },
];
