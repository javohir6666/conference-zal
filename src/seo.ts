export function venueJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    'name': 'Arenda-Zala.uz',
    'telephone': ['+998994084408', '+998998274422'],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Tashkent',
      'addressCountry': 'UZ'
    },
    'amenityFeature': [
      { '@type': 'LocationFeatureSpecification', 'name': 'Projector' },
      { '@type': 'LocationFeatureSpecification', 'name': 'Screen' },
      { '@type': 'LocationFeatureSpecification', 'name': 'Audio system' },
      { '@type': 'LocationFeatureSpecification', 'name': 'Microphones' }
    ],
    'maximumAttendeeCapacity': 500
  }
  return JSON.stringify(data)
}

