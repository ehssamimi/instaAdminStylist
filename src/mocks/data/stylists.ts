import type { StylistDetailDto, StylistRowDto } from '@/models/stylists'
import { getMockBookingRowsForStylist } from '@/lib/mock-bookings'

export const MOCK_STYLISTS: StylistRowDto[] = [
  {
    id: '1',
    profile_picture:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Jane',
    last_name: 'Smith',
    speciality: 'High fashion/editorial',
    bookings: 120,
    total_revenue: '$24,000',
    stylist_since: '2018',
    avg_weekly_availability: '10 hrs',
    avg_weekly_drop_in: '30 min',
  },
  {
    id: '2',
    profile_picture:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Mark',
    last_name: 'Johnson',
    speciality: 'Casual',
    bookings: 95,
    total_revenue: '$15,500',
    stylist_since: '2020',
    avg_weekly_availability: '20 hrs',
    avg_weekly_drop_in: '3 hrs',
  },
  {
    id: '3',
    profile_picture:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Sophia',
    last_name: 'Williams',
    speciality: 'Corporate/Professional Attire',
    bookings: 78,
    total_revenue: '$19,200',
    stylist_since: '2019',
    avg_weekly_availability: '15 hrs',
    avg_weekly_drop_in: '1 hr',
  },
  {
    id: '4',
    profile_picture:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Carlos',
    last_name: 'Rivera',
    speciality: 'Special events/weddings',
    bookings: 142,
    total_revenue: '$31,800',
    stylist_since: '2017',
    avg_weekly_availability: '25 hrs',
    avg_weekly_drop_in: '45 min',
  },
  {
    id: '5',
    profile_picture:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Amara',
    last_name: 'Okafor',
    speciality: 'Size-inclusive styling',
    bookings: 61,
    total_revenue: '$10,900',
    stylist_since: '2021',
    avg_weekly_availability: '12 hrs',
    avg_weekly_drop_in: '2 hrs',
  },
  {
    id: '6',
    profile_picture:
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Derek',
    last_name: 'Nguyen',
    speciality: 'Capsule Wardrobes',
    bookings: 88,
    total_revenue: '$17,400',
    stylist_since: '2019',
    avg_weekly_availability: '18 hrs',
    avg_weekly_drop_in: '1.5 hrs',
  },
  {
    id: '7',
    profile_picture:
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Priya',
    last_name: 'Mehta',
    speciality: 'Sustainable/eco-friendly fashion',
    bookings: 54,
    total_revenue: '$9,600',
    stylist_since: '2022',
    avg_weekly_availability: '8 hrs',
    avg_weekly_drop_in: '30 min',
  },
  {
    id: '8',
    profile_picture:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Liam',
    last_name: 'O\'Brien',
    speciality: 'Everyday wear',
    bookings: 103,
    total_revenue: '$21,000',
    stylist_since: '2018',
    avg_weekly_availability: '22 hrs',
    avg_weekly_drop_in: '2 hrs',
  },
  {
    id: '9',
    profile_picture:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Isabelle',
    last_name: 'Fontaine',
    speciality: 'Seasonal Refresh',
    bookings: 47,
    total_revenue: '$8,200',
    stylist_since: '2023',
    avg_weekly_availability: '10 hrs',
    avg_weekly_drop_in: '1 hr',
  },
  {
    id: '10',
    profile_picture:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Marcus',
    last_name: 'Hall',
    speciality: 'Close Cleanse',
    bookings: 72,
    total_revenue: '$13,500',
    stylist_since: '2020',
    avg_weekly_availability: '16 hrs',
    avg_weekly_drop_in: '45 min',
  },
  {
    id: '11',
    profile_picture:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Chloe',
    last_name: 'Dubois',
    speciality: 'High fashion/editorial',
    bookings: 135,
    total_revenue: '$28,900',
    stylist_since: '2016',
    avg_weekly_availability: '30 hrs',
    avg_weekly_drop_in: '1 hr',
  },
  {
    id: '12',
    profile_picture:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
    first_name: 'Ethan',
    last_name: 'Brooks',
    speciality: 'Corporate/Professional Attire',
    bookings: 91,
    total_revenue: '$18,700',
    stylist_since: '2019',
    avg_weekly_availability: '14 hrs',
    avg_weekly_drop_in: '2 hrs',
  },
]

const DETAIL_OVERRIDES: Record<string, Partial<StylistDetailDto>> = {
  '1': {
    email: 'jane.smith@example.com',
    gender: 'Female',
    businessName: 'Styled by Jane',
    location: 'New York, NY',
    linkedInUrl: 'https://linkedin.com/in/jane-stylist',
    tiktokHandle: '@janestyles',
    instagramOrFacebook: '@jane.styles',
    experience: '7 years',
    website: 'https://styledbyjane.com',
    bio: 'Wardrobe and personal stylist focused on events and premium looks.',
    specialityTags: ['High fashion/editorial', 'Special events/weddings', 'Capsule Wardrobes'],
    otherSpecialities: null,
    recommendShopIds: ['macys', 'zara'],
    otherShops: 'Nordstrom',
  },
  '2': {
    email: 'mark.johnson@example.com',
    gender: 'Male',
    businessName: 'Mark Style Co.',
    location: 'Los Angeles, CA',
    linkedInUrl: 'https://linkedin.com/in/mark-johnson-stylist',
    tiktokHandle: '@markstyle',
    instagramOrFacebook: '@mark.style',
    experience: '5 years',
    website: '—',
    bio: 'Casual and streetwear specialist with a focus on everyday confidence.',
    specialityTags: ['Everyday wear', 'Casual'],
    otherSpecialities: null,
    recommendShopIds: ['zara'],
    otherShops: null,
  },
}

export function getMockStylistDetail(id: string): StylistDetailDto | null {
  const row = MOCK_STYLISTS.find((s) => s.id === id)
  if (!row) return null

  const overrides = DETAIL_OVERRIDES[id] ?? {}
  const fullName = `${row.first_name} ${row.last_name}`
  const stylistBookings = getMockBookingRowsForStylist(fullName)

  return {
    ...row,
    email: overrides.email ?? `${row.first_name.toLowerCase()}.${row.last_name.toLowerCase()}@example.com`,
    gender: overrides.gender ?? null,
    businessName: overrides.businessName ?? `${row.first_name}'s Studio`,
    location: overrides.location ?? '—',
    linkedInUrl: overrides.linkedInUrl ?? null,
    tiktokHandle: overrides.tiktokHandle ?? null,
    instagramOrFacebook: overrides.instagramOrFacebook ?? null,
    experience: overrides.experience ?? `${new Date().getFullYear() - parseInt(row.stylist_since)} years`,
    website: overrides.website ?? '—',
    bio: overrides.bio ?? null,
    specialityTags: overrides.specialityTags ?? [row.speciality],
    otherSpecialities: overrides.otherSpecialities ?? null,
    recommendShopIds: overrides.recommendShopIds ?? [],
    otherShops: overrides.otherShops ?? null,
    booking_history: stylistBookings,
  }
}
