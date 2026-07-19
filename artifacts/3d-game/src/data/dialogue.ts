export type DialogueLine = { speaker: string; text: string; tip?: string };
export type NpcDialogue = { [npcId: string]: DialogueLine[] };

export const stageDialogue: { [stage: number]: NpcDialogue } = {
  1: {
    landlord: [
      {
        speaker: 'Landlord',
        text: "Welcome to your apartment! Your rent is $1,150/month. Don't be late!",
        tip: 'Rent is your biggest expense — about 30% of your income.',
      },
      {
        speaker: 'Landlord',
        text: "Remember, I can raise your rent anytime. Ever think about owning your own place?",
      },
      {
        speaker: 'Landlord',
        text: "You've been a great tenant. Keep saving — homeownership builds real wealth!",
      },
    ],
    laptop: [
      {
        speaker: 'You',
        text: 'Let me check my budget... Income $3,800, expenses $2,100. I have $1,700 left over each month.',
        tip: "Track every dollar. The 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
      },
    ],
    piggybank: [
      {
        speaker: 'You',
        text: 'I should put extra money toward savings or pay down debt to boost my credit score.',
        tip: 'Every $500 saved gets you closer to your $5,000 down payment fund goal.',
      },
    ],
  },
  2: {
    counselor: [
      {
        speaker: 'Housing Counselor',
        text: "Welcome! I'm Sarah, your HUD-certified housing counselor. Let's get you ready to buy!",
        tip: 'Newport News offers FREE housing counseling through the Department of Housing.',
      },
      {
        speaker: 'Housing Counselor',
        text: 'Your debt-to-income ratio should be under 43%. With $3,800 income, that\'s max $1,634/month in total debt payments.',
        tip: 'DTI = total monthly debt ÷ gross monthly income × 100',
      },
      {
        speaker: 'Housing Counselor',
        text: 'Newport News has a HOME Program offering up to $14,500 in down payment assistance for qualifying buyers!',
        tip: 'Income limits apply. Ask about the first-generation homebuyer bonus.',
      },
      {
        speaker: 'Housing Counselor',
        text: "With your savings and improving credit, you're on track! Let's get you pre-approved.",
        tip: "Pre-approval shows sellers you're a serious buyer and locks in your rate.",
      },
    ],
    whiteboard: [
      {
        speaker: 'Credit Score Guide',
        text: '620 = FHA minimum | 650 = better rates | 700+ = conventional rates | 740+ = best rates available.',
        tip: 'Each 20-point score improvement can save thousands over a 30-year mortgage.',
      },
    ],
    filing: [
      {
        speaker: 'Document Checklist',
        text: "You'll need: 2 months pay stubs, 2 years W-2s, 2 months bank statements, photo ID, and tax returns.",
        tip: 'Gather these early — missing docs are the #1 cause of mortgage delays.',
      },
    ],
  },
  3: {
    agent_h: [
      {
        speaker: 'Agent Maya',
        text: 'Welcome to Hilton Village! This charming colonial is $245,000. Historic neighborhood, great schools rated 4.2/5!',
        tip: 'Location affects resale value more than almost any other factor.',
      },
      {
        speaker: 'Agent Maya',
        text: 'Monthly payment estimate: $1,348. Walk to shops, parks, and the James River waterfront!',
        tip: 'Lenders prefer housing costs under 28-31% of gross monthly income.',
      },
    ],
    agent_d: [
      {
        speaker: 'Agent Marcus',
        text: 'Denbigh is a great value neighborhood! This ranch home is $198,000 — payment just $1,089/month.',
        tip: 'Starter homes often appreciate faster percentage-wise than luxury homes.',
      },
    ],
    agent_o: [
      {
        speaker: 'Agent Lisa',
        text: "Oyster Point is Newport News's hottest zip code! Walkability score 81, commute only 12 minutes.",
        tip: 'Walkability score affects both quality of life and home resale value.',
      },
    ],
    agent_s: [
      {
        speaker: 'Agent James',
        text: 'Southeast is our most affordable option at $168,000 — lowest payment at $924/month. Great investment potential!',
        tip: 'Buying in an up-and-coming neighborhood can yield strong equity growth.',
      },
    ],
    // Tour NPC dialogue — triggered when player enters the living room during a home walkthrough
    tour_npc: [
      {
        speaker: 'Agent',
        text: "Welcome! Take your time exploring each room. Click the teal markers to discover highlights — they affect resale value and your daily life.",
        tip: "A home tour should take 30–45 minutes. Rushing is one of the most common buyer mistakes.",
      },
      {
        speaker: 'Agent',
        text: "Notice how natural light fills this space. Lighting is one of the top factors buyers mention after moving in — and one of the hardest to change.",
        tip: "If possible, visit a home at different times of day to see how light changes throughout.",
      },
      {
        speaker: 'Agent',
        text: "Remember — you're buying the bones of a home, not the décor. Cosmetic changes are cheap. Structural issues are expensive. Always budget for an inspection!",
        tip: "A home inspection costs $300–$500 and can reveal issues worth tens of thousands to fix.",
      },
    ],
  },
  4: {
    seller: [
      {
        speaker: 'Seller',
        text: "We received your offer. Let me talk to my attorney...",
      },
      {
        speaker: 'Seller',
        text: "We've reviewed your terms. The inspection contingency you included protects you — that's a smart move.",
        tip: 'Never waive an inspection contingency. Defects can cost tens of thousands to fix.',
      },
    ],
  },
  5: {
    loanOfficer: [
      {
        speaker: 'Loan Officer',
        text: "Good afternoon! I'm reviewing your mortgage application. I'll need several documents from you.",
        tip: 'The average mortgage approval takes 30-60 days. Starting early reduces stress.',
      },
      {
        speaker: 'Loan Officer',
        text: 'Based on your credit score and income, you qualify for a 30-year loan.',
        tip: 'FHA loans require only 3.5% down with a 580+ credit score.',
      },
      {
        speaker: 'Loan Officer',
        text: "With the Newport News DOWN payment assistance, your closing costs are significantly reduced.",
        tip: '1% lower interest rate saves ~$200/month on a $250K loan — huge over 30 years.',
      },
    ],
  },
  6: {
    notary: [
      {
        speaker: 'Notary Patricia',
        text: "Congratulations and welcome to closing! Please review each document carefully before signing.",
        tip: 'You have a legal right to read everything. Never feel rushed at closing.',
      },
      {
        speaker: 'Notary Patricia',
        text: "The Purchase Agreement transfers ownership. The Promissory Note is your promise to repay the loan.",
        tip: 'Keep copies of ALL closing documents in a safe place for life.',
      },
      {
        speaker: 'Notary Patricia',
        text: "Final step — here are your keys! You are now a homeowner. Congratulations!",
      },
    ],
  },
};
