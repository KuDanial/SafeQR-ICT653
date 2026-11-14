export const initialMerchants = [
  {
    id: 'm1',
    name: 'Kedai Makan Ali',
    category: 'Food & Beverage',
    ssmNumber: 'SSM-202301048821',
    duitNowId: '012-3456789',
    verified: true,
    riskScore: 'Safe (0.01%)',
    location: 'Bangsar, Kuala Lumpur',
    accountName: 'Ali Nasi Lemak Enterprise',
    bank: 'Maybank',
    avatar: '🍛',
  },
  {
    id: 'm2',
    name: 'Warung Kopi Tok Wan',
    category: 'Local Café',
    ssmNumber: 'SSM-202103449110',
    duitNowId: '019-8765432',
    verified: true,
    riskScore: 'Safe (0.02%)',
    location: 'Shah Alam, Selangor',
    accountName: 'Tok Wan Beverages Enterprise',
    bank: 'CIMB Bank',
    avatar: '☕',
  },
  {
    id: 'm3_fake',
    name: '⚠️ SUSPICIOUS STALL (STICKER OVERWRITE)',
    category: 'Unverified Entity',
    ssmNumber: 'NOT_FOUND',
    duitNowId: '011-99887766',
    verified: false,
    isTampered: true,
    tamperReason: 'QR Code sticker mismatch! Physical sticker overlays registered merchant "Kedai Makan Ali" with mule account: "SYNDICATE TRADING ENT".',
    riskScore: 'CRITICAL HIGH (98.4%)',
    location: 'Flagged Location: Bangsar Stall #4',
    accountName: 'Syndicate Global Enterprise',
    bank: 'Unknown Virtual Bank',
    avatar: '🚨',
  }
];

export const initialPendingVerifications = [
  {
    id: 'pv1',
    businessName: 'Roti Canai Transfer Road',
    ownerName: 'Muhammad Faris',
    category: 'Hawker Stall',
    ssmNumber: 'SSM-202409112044',
    submittedAt: 'Today, 10:15 AM',
    location: 'George Town, Penang',
    status: 'Pending',
    documentsAttached: ['SSM Cert.pdf', 'Premise License.jpg', 'DuitNow Certificate.pdf']
  },
  {
    id: 'pv2',
    businessName: 'Ah Huat Durian Stall',
    ownerName: 'Tan Ah Huat',
    category: 'Fruit Stall',
    ssmNumber: 'SSM-202305118933',
    submittedAt: 'Today, 11:40 AM',
    location: 'Raub, Pahang',
    status: 'Pending',
    documentsAttached: ['SSM Cert.pdf', 'DuitNow Statement.pdf']
  },
  {
    id: 'pv3',
    businessName: 'Kak Mas Goreng Pisang Crispy',
    ownerName: 'Maslinda binti Ramli',
    category: 'Street Vendor',
    ssmNumber: 'SSM-202401827734',
    submittedAt: 'Yesterday, 4:20 PM',
    location: 'Bangi, Selangor',
    status: 'Pending',
    documentsAttached: ['SSM Cert.pdf']
  }
];

export const initialScamReports = [
  {
    id: 'sr1',
    type: 'Fake QR Code (Sticker Overwrite)',
    merchantName: 'Nasi Kandar Pelita Corner',
    description: 'Found a glossy sticker pasted right on top of the counter acrylic QR stand. Scanned code redirected to a personal bank account instead of Pelita.',
    reporter: 'Siti Sarah (Customer)',
    reportedAt: '15 mins ago',
    status: 'Under Investigation',
    severity: 'High'
  },
  {
    id: 'sr2',
    type: 'Fake Payment Receipt',
    merchantName: 'Uncle Lim Grocer',
    description: 'Customer showed an edited screenshot of RM85.00 transfer. Merchant checking SafeQR verified live feed confirmed no funds arrived. Customer fled.',
    reporter: 'Uncle Lim (Merchant)',
    reportedAt: '1 hour ago',
    status: 'Verified Fraud',
    severity: 'High'
  },
  {
    id: 'sr3',
    type: 'Fake QR Code (Duplicate Stand)',
    merchantName: 'Pasar Malam SS2 Bubble Tea',
    description: 'A miniature QR stand placed beside the cashier was non-authentic. Alert triggered before transaction completed.',
    reporter: 'Ahmad Faiz (Customer)',
    reportedAt: '3 hours ago',
    status: 'Resolved',
    severity: 'Medium'
  }
];

export const initialMerchantTransactions = [
  {
    id: 'tx-994',
    customerName: 'Chong Wei Ming',
    amount: 15.00,
    time: '2 mins ago',
    status: 'Real-Time Settled ✅',
    authRef: 'SQ-8849-MY',
    method: 'DuitNow QR via SafeQR Guard'
  },
  {
    id: 'tx-993',
    customerName: 'Nurul Huda',
    amount: 28.50,
    time: '18 mins ago',
    status: 'Real-Time Settled ✅',
    authRef: 'SQ-8848-MY',
    method: 'DuitNow QR via SafeQR Guard'
  },
  {
    id: 'tx-992',
    customerName: 'Kavitha Devi',
    amount: 8.00,
    time: '42 mins ago',
    status: 'Real-Time Settled ✅',
    authRef: 'SQ-8847-MY',
    method: 'DuitNow QR via SafeQR Guard'
  }
];
