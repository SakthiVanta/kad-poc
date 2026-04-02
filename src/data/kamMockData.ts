// ─── KAE Mock Data ────────────────────────────────────────────────────────────

const kaeNames = [
  'Rajan Kumar', 'Priya Sharma', 'Arjun Nair', 'Divya Menon', 'Santhosh Raj',
  'Kavitha Suresh', 'Manoj Pillai', 'Deepa Krishnan', 'Vikram Patel', 'Anitha Ravi',
  'Suresh Babu', 'Lakshmi Devi', 'Karthik Selvan', 'Meera Iyer', 'Bala Murugan',
  'Sowmya Natarajan', 'Dinesh Chandran', 'Revathi Srinivasan', 'Prashanth Kumar', 'Nithya Balan',
  'Ramesh Venkat', 'Usha Krishnamurthy', 'Selvam Pandian', 'Geetha Jayaraj',
];

export const mockKAEs = kaeNames.map((name, i) => {
  const idx = i + 1;
  const phones = [
    '9876543210','9823456789','9834567890','9845678901','9856789012',
    '9867890123','9878901234','9889012345','9890123456','9801234567',
    '9812345678','9843456789','9854567890','9865678901','9876789012',
    '9887890123','9898901234','9809012345','9810123456','9821234567',
    '9832345678','9843456780','9854567891','9865678902',
  ];
  const cities = ['Chennai', 'Chennai', 'Chennai', 'Bangalore', 'Chennai'];
  return {
    id: idx,
    empId: `BWG_KAE_${String(idx).padStart(3, '0')}`,
    name,
    phone: phones[i],
    email: `${name.split(' ')[0].toLowerCase()}@bwg.com`,
    city: cities[i % cities.length],
    status: idx <= 22 ? 'active' : 'inactive',
    beatsAssigned: Math.min(12, 8 + (i % 5)),
    lastActive: idx % 3 === 0 ? '2026-03-31' : '2026-04-01',
    createdAt: '2025-01-15',
    department: 'Field Sales',
  };
});

// ─── Beat Mock Data ───────────────────────────────────────────────────────────

export interface Mandapam {
  id: number;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  bwgPromise: boolean;
}

export interface Beat {
  id: string;
  code: string;
  name: string;
  area: string;
  city: string;
  mandapams: Mandapam[];
  assignedKAEId: number | null;
  status: 'active' | 'inactive';
}

const makeMandapams = (beatName: string, count: number): Mandapam[] =>
  Array.from({ length: count }, (_, i) => ({
    id: parseInt(`${beatName.charCodeAt(0)}${i + 1}`),
    name: `${beatName} Hall ${String.fromCharCode(65 + i)}`,
    status: ((['active', 'active', 'active', 'pending', 'inactive'] as const)[i % 5]),
    bwgPromise: i % 3 === 0,
  }));

export const mockBeats: Beat[] = [
  { id: 'B001', code: 'C1-TNR', name: 'T Nagar',       area: 'T Nagar',       city: 'Chennai',   mandapams: makeMandapams('T Nagar',      12), assignedKAEId: 1,    status: 'active' },
  { id: 'B002', code: 'C2-ADY', name: 'Adyar',          area: 'Adyar',          city: 'Chennai',   mandapams: makeMandapams('Adyar',         11), assignedKAEId: 2,    status: 'active' },
  { id: 'B003', code: 'C3-ANN', name: 'Anna Nagar',     area: 'Anna Nagar',     city: 'Chennai',   mandapams: makeMandapams('Anna Nagar',   12), assignedKAEId: 3,    status: 'active' },
  { id: 'B004', code: 'C4-VEL', name: 'Velachery',      area: 'Velachery',      city: 'Chennai',   mandapams: makeMandapams('Velachery',    10), assignedKAEId: 4,    status: 'active' },
  { id: 'B005', code: 'C5-MYL', name: 'Mylapore',       area: 'Mylapore',       city: 'Chennai',   mandapams: makeMandapams('Mylapore',     12), assignedKAEId: 5,    status: 'active' },
  { id: 'B006', code: 'C6-NUN', name: 'Nungambakkam',   area: 'Nungambakkam',   city: 'Chennai',   mandapams: makeMandapams('Nungambakkam', 11), assignedKAEId: 6,    status: 'active' },
  { id: 'B007', code: 'C7-TAM', name: 'Tambaram',       area: 'Tambaram',       city: 'Chennai',   mandapams: makeMandapams('Tambaram',     12), assignedKAEId: 7,    status: 'active' },
  { id: 'B008', code: 'C8-CHR', name: 'Chromepet',      area: 'Chromepet',      city: 'Chennai',   mandapams: makeMandapams('Chromepet',    10), assignedKAEId: 8,    status: 'active' },
  { id: 'B009', code: 'C9-POR', name: 'Porur',          area: 'Porur',          city: 'Chennai',   mandapams: makeMandapams('Porur',        11), assignedKAEId: 9,    status: 'active' },
  { id: 'B010', code: 'C10-GUI', name: 'Guindy',        area: 'Guindy',         city: 'Chennai',   mandapams: makeMandapams('Guindy',       12), assignedKAEId: 10,   status: 'active' },
  { id: 'B011', code: 'C11-EGM', name: 'Egmore',        area: 'Egmore',         city: 'Chennai',   mandapams: makeMandapams('Egmore',       10), assignedKAEId: 11,   status: 'active' },
  { id: 'B012', code: 'C12-KIL', name: 'Kilpauk',       area: 'Kilpauk',        city: 'Chennai',   mandapams: makeMandapams('Kilpauk',      12), assignedKAEId: 12,   status: 'active' },
  { id: 'B013', code: 'C13-ASH', name: 'Ashok Nagar',   area: 'Ashok Nagar',    city: 'Chennai',   mandapams: makeMandapams('Ashok Nagar',  11), assignedKAEId: 13,   status: 'active' },
  { id: 'B014', code: 'C14-BES', name: 'Besant Nagar',  area: 'Besant Nagar',   city: 'Chennai',   mandapams: makeMandapams('Besant Nagar', 10), assignedKAEId: 14,   status: 'active' },
  { id: 'B015', code: 'C15-ALW', name: 'Alwarpet',      area: 'Alwarpet',       city: 'Chennai',   mandapams: makeMandapams('Alwarpet',     12), assignedKAEId: 15,   status: 'active' },
  { id: 'B016', code: 'C16-PER', name: 'Perambur',      area: 'Perambur',       city: 'Chennai',   mandapams: makeMandapams('Perambur',     10), assignedKAEId: 16,   status: 'active' },
  { id: 'B017', code: 'C17-KOY', name: 'Koyyambedu',    area: 'Koyyambedu',     city: 'Chennai',   mandapams: makeMandapams('Koyyambedu',   11), assignedKAEId: null, status: 'inactive' },
  { id: 'B018', code: 'C18-AMB', name: 'Ambattur',      area: 'Ambattur',       city: 'Chennai',   mandapams: makeMandapams('Ambattur',     12), assignedKAEId: null, status: 'inactive' },
];
