/**
 * Newport News housing market data — researched July 2026.
 *
 * Sources: RentCafe / Yardi Matrix market trends (city avg rent ~$1,439/mo,
 * May 2026), Zillow rental market trends (avg all-types rent ~$1,600, June
 * 2026), HUD Fair Market Rent 2026 (2-BR FMR $1,584), Redfin/Houzeo market
 * reports (median sale price ~$274K–$309K, early 2026), realtor.com
 * neighborhood pages, and the listed rental communities' own sites.
 *
 * Figures are neighborhood-level estimates rounded from those sources —
 * always verify current pricing on Zillow or with the property.
 */

export interface Neighborhood {
  id: string;
  name: string;
  tagline: string;
  /** Approximate center of the neighborhood */
  lat: number;
  lng: number;
  /** Typical home value (2026 est.) */
  medianHome: string;
  /** Typical apartment rent (2026 est.) */
  medianRent: string;
  walk: string;
  schools: string;
  parks: string;
  restaurants: string;
  zillowBuyUrl: string;
  zillowRentUrl: string;
}

const zBuy = (slug: string) =>
  `https://www.zillow.com/homes/for_sale/${slug},-Newport-News,-VA_rb/`;
const zRent = (slug: string) =>
  `https://www.zillow.com/homes/for_rent/${slug},-Newport-News,-VA_rb/`;

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'hilton',
    name: 'Hilton Village',
    tagline:
      "A 1918 planned English-village community on the National Register of Historic Places — brick storefronts on Warwick Boulevard, the James River waterfront, and tree-lined streets.",
    lat: 37.0067,
    lng: -76.4522,
    medianHome: '$330,000',
    medianRent: '$1,400',
    walk: '8.1',
    schools: '7.8',
    parks: '5',
    restaurants: '22',
    zillowBuyUrl: zBuy('Hilton-Village'),
    zillowRentUrl: zRent('Hilton-Village'),
  },
  {
    id: 'port-warwick',
    name: 'Port Warwick',
    tagline:
      'An award-winning mixed-use urban village centered on the three-acre Styron Square — condos and townhomes above shops, restaurants, and offices off Jefferson Avenue.',
    lat: 37.0505,
    lng: -76.4695,
    medianHome: '$425,000',
    medianRent: '$1,800',
    walk: '8.6',
    schools: '7.9',
    parks: '3',
    restaurants: '28',
    zillowBuyUrl: zBuy('Port-Warwick'),
    zillowRentUrl: zRent('Port-Warwick'),
  },
  {
    id: 'oyster-point',
    name: 'Oyster Point & City Center',
    tagline:
      "Newport News' business district — City Center at Oyster Point pairs a fountain plaza with upscale apartments, Tech Center employers, and some of the city's best dining.",
    lat: 37.0665,
    lng: -76.4925,
    medianHome: '$350,000',
    medianRent: '$1,650',
    walk: '7.6',
    schools: '7.8',
    parks: '4',
    restaurants: '45',
    zillowBuyUrl: zBuy('Oyster-Point'),
    zillowRentUrl: zRent('Oyster-Point'),
  },
  {
    id: 'kiln-creek',
    name: 'Kiln Creek',
    tagline:
      'A master-planned community of 31 "villages" wrapped around a golf course and ponds — over 2,000 homes, an elementary school, and quick access to I-64 and Patrick Henry Mall.',
    lat: 37.1226,
    lng: -76.4885,
    medianHome: '$370,000',
    medianRent: '$1,750',
    walk: '6.4',
    schools: '8.4',
    parks: '6',
    restaurants: '30',
    zillowBuyUrl: zBuy('Kiln-Creek'),
    zillowRentUrl: zRent('Kiln-Creek'),
  },
  {
    id: 'denbigh',
    name: 'Denbigh',
    tagline:
      'A large, established suburban area in the north of the city — affordable single-family homes and apartments, strong schools, parks, and everyday shopping along Denbigh Boulevard.',
    lat: 37.14,
    lng: -76.531,
    medianHome: '$285,000',
    medianRent: '$1,450',
    walk: '6.8',
    schools: '8.2',
    parks: '8',
    restaurants: '34',
    zillowBuyUrl: zBuy('Denbigh'),
    zillowRentUrl: zRent('Denbigh'),
  },
  {
    id: 'southeast',
    name: 'Southeast Community',
    tagline:
      "The city's historic heart near the shipyard and downtown — rich in culture, actively revitalizing, and home to the city's most affordable housing options.",
    lat: 36.9815,
    lng: -76.4235,
    medianHome: '$200,000',
    medianRent: '$1,100',
    walk: '6.9',
    schools: '7.0',
    parks: '6',
    restaurants: '16',
    zillowBuyUrl: zBuy('Southeast-Community'),
    zillowRentUrl: zRent('Southeast-Community'),
  },
];

export const CITY_MARKET = {
  avgRent: '$1,439–$1,600',
  fmr2Br: '$1,584',
  medianSalePrice: '$274,000–$309,000',
  updated: 'Mid-2026',
};

/** Real rental communities in Newport News (rents are advertised 2026 ranges — verify with the property). */
export interface RentalListing {
  id: number;
  name: string;
  price: string;
  /** Numeric starting rent, used for max-rent filtering */
  minRent: number;
  /** Largest bedroom count offered, used for beds filtering (studio = 0 min) */
  maxBeds: number;
  priceNote: string;
  beds: string;
  baths: string;
  sqft: string;
  hood: string;
  address: string;
  url: string;
}

export const RENTALS: RentalListing[] = [
  {
    id: 1,
    name: 'Hilton Village Townhomes',
    price: '$1,253+',
    minRent: 1253,
    maxBeds: 3,
    priceNote: '1–3 BR from $1,253',
    beds: '1–3',
    baths: '1–1.5',
    sqft: '700–1,200 sqft',
    hood: 'Hilton Village',
    address: '531 Bulkeley Pl',
    url: 'https://www.zillow.com/homes/for_rent/Hilton-Village,-Newport-News,-VA_rb/',
  },
  {
    id: 2,
    name: 'Heritage Forest Apartments',
    price: '$1,350+',
    minRent: 1350,
    maxBeds: 3,
    priceNote: '1–3 BR apartments & homes',
    beds: '1–3',
    baths: '1–2',
    sqft: '750–1,300 sqft',
    hood: 'Denbigh',
    address: 'Heritage Forest Ln',
    url: 'https://www.zillow.com/homes/for_rent/Denbigh,-Newport-News,-VA_rb/',
  },
  {
    id: 3,
    name: 'Venture Apartments iN Tech Center',
    price: '$1,600+',
    minRent: 1600,
    maxBeds: 3,
    priceNote: 'Studio–3 BR near Tech Center',
    beds: 'Studio–3',
    baths: '1–2',
    sqft: '600–1,400 sqft',
    hood: 'Oyster Point',
    address: '685 Tech Center Pkwy',
    url: 'https://www.zillow.com/homes/for_rent/Oyster-Point,-Newport-News,-VA_rb/',
  },
  {
    id: 4,
    name: 'Park Place at City Center',
    price: '$1,550+',
    minRent: 1550,
    maxBeds: 3,
    priceNote: 'Luxury living at City Center',
    beds: '1–3',
    baths: '1–2',
    sqft: '700–1,450 sqft',
    hood: 'Oyster Point',
    address: 'City Center at Oyster Point',
    url: 'https://www.zillow.com/homes/for_rent/Oyster-Point,-Newport-News,-VA_rb/',
  },
  {
    id: 5,
    name: 'The Suites at Port Warwick',
    price: '$1,700+',
    minRent: 1700,
    maxBeds: 2,
    priceNote: 'Upscale suites on Styron Square',
    beds: '1–2',
    baths: '1–2',
    sqft: '750–1,250 sqft',
    hood: 'Port Warwick',
    address: 'Styron Square area',
    url: 'https://www.zillow.com/homes/for_rent/Port-Warwick,-Newport-News,-VA_rb/',
  },
  {
    id: 6,
    name: 'Admiral Pointe Apartments',
    price: '$1,050+',
    minRent: 1050,
    maxBeds: 3,
    priceNote: 'Income-restricted affordable community',
    beds: '1–3',
    baths: '1–2',
    sqft: '700–1,150 sqft',
    hood: 'Southeast',
    address: 'Southeast Community',
    url: 'https://www.zillow.com/homes/for_rent/Newport-News,-VA_rb/',
  },
];

export const ZILLOW_ALL_RENTALS = 'https://www.zillow.com/newport-news-va/rentals/';
export const ZILLOW_ALL_HOMES = 'https://www.zillow.com/newport-news-va/';
