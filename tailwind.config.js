module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/**/*.css',
      './app/**/*.html',
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: '#EDE7E3',
        secondary: '#3F3F3F',
        tertiary: '#CD6161'
      },
      fontFamily: {
        heading: ['Exo'],
        body: ['Source Code Pro']
      },
      borderRadius: {
        twenty: '20px'
      }
    },
  },
  variants: {},
  plugins: [],
}
