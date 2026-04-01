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
    }
  }
];
