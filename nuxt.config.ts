export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href:'https://fonts.googleapis.com/css?family=Noto+Sans+JP:300,400,900&display=swap&subset=japanese', rel:'stylesheet' }

    ],
    script: [
      { src: 'https://kit.fontawesome.com/4f673b0b85.js', defer: true }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/init.client.ts',
    '~/plugins/init2.client.ts',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/dotenv',
  ],
  styleResources: {
    // your settings here
    scss: ['./assets/common/*.scss'],
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // extend(config, ctx) {
    // }
  },
};
