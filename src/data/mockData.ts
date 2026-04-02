export const trafficData = [
  { name: 'M', traffic: 4200 }, { name: 'TU', traffic: 5100 },
  { name: 'W', traffic: 3800 }, { name: 'TH', traffic: 7200 },
  { name: 'F', traffic: 5900 }, { name: 'SA', traffic: 3100 },
  { name: 'SU', traffic: 6800 },
];

export const venues = [
  {
    id: '5065',
    name: 'The Grand Hall',
    location: 'Central Plaza, Hub 4',
    lastVisit: '18-Mar-2026',
    suggested: 4,
    booked: 3,
    commCollected: 2,
    pendingComm: 1,
    traffic: '56,000',
    status: 'Yes',
    image: 'https://picsum.photos/seed/hall/400/300',
    description: 'A premium luxury hall suitable for corporate events and grand weddings. Features state-of-the-art acoustics and a dedicated catering wing.',
    manager: 'Rahul Sharma',
    contact: '+91 98765 43210',
    vendor: {
      name: 'Elite Events & Hospitality',
      owner: 'Suresh Raina',
      phone: '9876543211',
      email: 'suresh.raina@eliteevents.com',
      address: '123, MG Road, Bangalore',
      businessSince: '2020',
      totalProperties: 5
    },
    crmDetails: {
      totalLeads: 142,
      conversionRate: '12.5%',
      lastCall: '20-Mar-2026',
      notes: [
        "Vendor requested more marketing support for the upcoming festive season.",
        "Payment for Jan commission was slightly delayed due to bank issues.",
        "High interest in 'BWG Promise' tier upgrade."
      ],
      visitHistory: [
        { date: '18-Mar-2026', purpose: 'Collection', status: 'Success' },
        { date: '10-Mar-2026', purpose: 'Training', status: 'Completed' },
        { date: '01-Mar-2026', purpose: 'Logistics', status: 'Pending' }
      ]
    },
    audit: {
      platformIQ: {
        score: 85,
        rank: 'Platinum',
        breakdown: [
          { label: 'Visit Frequency', score: 90 },
          { label: 'Commission Punctuality', score: 88 },
          { label: 'Lead Conversion', score: 75 },
          { label: 'BWG Compliance', score: 92 },
          { label: 'Response Rate', score: 80 },
        ]
      },
      summary: {
        totalVisits: 24,
        visitsThisMonth: 3,
        totalLeads: 142,
        convertedLeads: 112,
        pendingLeads: 18,
        lostLeads: 12,
        commissionCollected: 420000,
        commissionPending: 80000,
        avgVisitScore: 4.2,
        bwgStatus: 'Promise',
      },
      visitLog: [
        { date: '18-Mar-2026', type: 'Commission', outcome: 'Collected', executive: 'Rajan K.', notes: '₹45,000 collected via UPI. Owner cooperative.' },
        { date: '10-Mar-2026', type: 'P1 Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'Discussed BWG upgrade to Gold tier. Owner interested, board approval pending.' },
        { date: '01-Mar-2026', type: 'General Visit', outcome: 'Pending', executive: 'Rajan K.', notes: 'Venue under minor renovation, follow up scheduled.' },
        { date: '22-Feb-2026', type: 'BWG Upgrade', outcome: 'Declined', executive: 'Rajan K.', notes: 'Owner not ready, revisit in Q2.' },
        { date: '10-Feb-2026', type: 'General Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'New banquet hall opening next month. Lead opportunity.' },
        { date: '28-Jan-2026', type: 'Commission', outcome: 'Collected', executive: 'Rajan K.', notes: '₹1,20,000 collected via cheque. Minor delay due to bank holiday.' },
      ],
      commissionLog: [
        { month: 'Mar 2026', collected: 45000, pending: 0, mode: 'UPI', status: 'Paid' },
        { month: 'Feb 2026', collected: 120000, pending: 30000, mode: 'Cheque', status: 'Partial' },
        { month: 'Jan 2026', collected: 255000, pending: 50000, mode: 'NEFT', status: 'Partial' },
        { month: 'Dec 2025', collected: 0, pending: 0, mode: '—', status: 'No Commission' },
      ],
    }
  },
  {
    id: '5068',
    name: 'Emerald Banquet',
    location: 'Green Park, West Wing',
    lastVisit: '16-Mar-2026',
    suggested: 3,
    booked: 2,
    commCollected: 1,
    pendingComm: 1,
    traffic: '42,500',
    status: 'Partial',
    image: 'https://picsum.photos/seed/banquet/400/300',
    description: 'Eco-friendly banquet space with a focus on natural lighting and sustainable event management.',
    manager: 'Priya Patel',
    contact: '+91 87654 32109',
    vendor: {
      name: 'Green Horizon Venues',
      owner: 'Anita Desai',
      phone: '9823456789',
      email: 'anita@greenhorizon.com',
      address: '45, Indiranagar, Bangalore',
      businessSince: '2021',
      totalProperties: 3
    },
    crmDetails: {
      totalLeads: 89,
      conversionRate: '9.2%',
      lastCall: '15-Mar-2026',
      notes: [
        'Looking for more corporate lead generation.',
        'Excellent feedback on current platform usability.'
      ],
      visitHistory: [
        { date: '16-Mar-2026', purpose: 'Support', status: 'Success' },
        { date: '05-Mar-2026', purpose: 'Collection', status: 'Success' }
      ]
    },
    audit: {
      platformIQ: {
        score: 68,
        rank: 'Gold',
        breakdown: [
          { label: 'Visit Frequency', score: 72 },
          { label: 'Commission Punctuality', score: 65 },
          { label: 'Lead Conversion', score: 60 },
          { label: 'BWG Compliance', score: 78 },
          { label: 'Response Rate', score: 65 },
        ]
      },
      summary: {
        totalVisits: 14,
        visitsThisMonth: 2,
        totalLeads: 89,
        convertedLeads: 58,
        pendingLeads: 20,
        lostLeads: 11,
        commissionCollected: 180000,
        commissionPending: 45000,
        avgVisitScore: 3.6,
        bwgStatus: 'Non-BWG',
      },
      visitLog: [
        { date: '16-Mar-2026', type: 'General Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'Discussed platform benefits. Owner receptive.' },
        { date: '05-Mar-2026', type: 'Commission', outcome: 'Collected', executive: 'Rajan K.', notes: '₹30,000 collected via NEFT.' },
        { date: '18-Feb-2026', type: 'P1 Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'Initial pitch for BWG Promise tier. Owner needs time.' },
      ],
      commissionLog: [
        { month: 'Mar 2026', collected: 30000, pending: 15000, mode: 'NEFT', status: 'Partial' },
        { month: 'Feb 2026', collected: 60000, pending: 0, mode: 'UPI', status: 'Paid' },
        { month: 'Jan 2026', collected: 90000, pending: 30000, mode: 'Cheque', status: 'Partial' },
      ],
    }
  },
  {
    id: '4921',
    name: 'Royal Residency',
    location: 'Old Town Square',
    lastVisit: '14-Mar-2026',
    suggested: 6,
    booked: 5,
    commCollected: 5,
    pendingComm: 0,
    traffic: '68,200',
    status: 'No',
    image: 'https://picsum.photos/seed/residency/400/300',
    description: 'Heritage residency offering a classic old-world charm combined with modern amenities.',
    manager: 'Vikram Singh',
    contact: '+91 76543 21098',
    vendor: {
      name: 'Heritage Hospitality Group',
      owner: 'Rajesh Khanna',
      phone: '9834567890',
      email: 'rajesh@heritagegroup.com',
      address: '99, Brigade Road, Bangalore',
      businessSince: '2018',
      totalProperties: 8
    },
    crmDetails: {
      totalLeads: 215,
      conversionRate: '15.8%',
      lastCall: '22-Mar-2026',
      notes: [
        'Highly satisfied with BWG services.',
        'Planning to list 2 more properties by next month.'
      ],
      visitHistory: [
        { date: '14-Mar-2026', purpose: 'Follow-up', status: 'Success' },
        { date: '02-Mar-2026', purpose: 'Listing', status: 'Completed' }
      ]
    },
    audit: {
      platformIQ: {
        score: 94,
        rank: 'Diamond',
        breakdown: [
          { label: 'Visit Frequency', score: 96 },
          { label: 'Commission Punctuality', score: 100 },
          { label: 'Lead Conversion', score: 88 },
          { label: 'BWG Compliance', score: 95 },
          { label: 'Response Rate', score: 92 },
        ]
      },
      summary: {
        totalVisits: 38,
        visitsThisMonth: 4,
        totalLeads: 215,
        convertedLeads: 185,
        pendingLeads: 20,
        lostLeads: 10,
        commissionCollected: 980000,
        commissionPending: 0,
        avgVisitScore: 4.8,
        bwgStatus: 'BWG Gold',
      },
      visitLog: [
        { date: '14-Mar-2026', type: 'General Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'Vendor planning 2 new listings next month. Excellent relationship.' },
        { date: '02-Mar-2026', type: 'Commission', outcome: 'Collected', executive: 'Rajan K.', notes: '₹3,40,000 collected on time via NEFT. Zero issues.' },
        { date: '18-Feb-2026', type: 'BWG Upgrade', outcome: 'Completed', executive: 'Rajan K.', notes: 'Upgraded to BWG Gold. Signed new agreement.' },
        { date: '05-Feb-2026', type: 'P1 Visit', outcome: 'Success', executive: 'Rajan K.', notes: 'Strong performance review. Recommended for Diamond tier.' },
        { date: '20-Jan-2026', type: 'Commission', outcome: 'Collected', executive: 'Rajan K.', notes: '₹2,80,000 collected. On-time payment, no follow-up needed.' },
        { date: '08-Jan-2026', type: 'Lead Capture', outcome: 'Success', executive: 'Rajan K.', notes: 'Captured 12 new leads from venue event. High quality prospects.' },
      ],
      commissionLog: [
        { month: 'Mar 2026', collected: 340000, pending: 0, mode: 'NEFT', status: 'Paid' },
        { month: 'Feb 2026', collected: 360000, pending: 0, mode: 'NEFT', status: 'Paid' },
        { month: 'Jan 2026', collected: 280000, pending: 0, mode: 'NEFT', status: 'Paid' },
        { month: 'Dec 2025', collected: 0, pending: 0, mode: '—', status: 'No Commission' },
      ],
    }
  }
];
