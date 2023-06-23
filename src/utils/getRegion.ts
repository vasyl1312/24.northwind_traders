type Region =
  | 'Western Europe'
  | 'Eastern Europe'
  | 'Northern Europe'
  | 'North America'
  | 'Central America'
  | 'South America'
  | 'East Asia'
  | 'Oceania'

export const getRegion = (country: string): Region | null => {
  const westernEuropeCountries = [
    'Germany',
    'France',
    'Spain',
    'Switzerland',
    'Austria',
    'Italy',
    'Portugal',
    'Belgium',
    'Netherlands',
    'Ireland',
    'UK',
  ]

  const eastAsiaCountries = ['Japan', 'Singapore']
  const oceaniaCountries = ['Australia']
  const easternEuropeCountries = ['Poland']
  const northernEuropeCountries = ['Sweden', 'Norway', 'Denmark', 'Finland', 'Sweden ']
  const centralAmericaCountries = ['Mexico']
  const northAmericaCountries = ['USA', 'Canada']
  const southAmericaCountries = ['Argentina', 'Brazil', 'Venezuela']

  if (oceaniaCountries.includes(country)) return 'Oceania'
  if (eastAsiaCountries.includes(country)) return 'East Asia'
  if (northAmericaCountries.includes(country)) return 'North America'
  if (southAmericaCountries.includes(country)) return 'South America'
  if (westernEuropeCountries.includes(country)) return 'Western Europe'
  if (easternEuropeCountries.includes(country)) return 'Eastern Europe'
  if (centralAmericaCountries.includes(country)) return 'Central America'
  if (northernEuropeCountries.includes(country)) return 'Northern Europe'

  return null
}
