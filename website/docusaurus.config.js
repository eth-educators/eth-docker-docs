module.exports = {
    title: 'eth2-docker',
    tagline: 'Ethereum 2 Docker Client',
    url: 'https://github.com/eth2-educators/eth2-docker',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/Moby-logo.png',
    organizationName: 'Eth2 Docker',
    projectName: 'eth2-docker',
    customFields: {
        image: 'img/Moby-logo.png',
    },
    scripts: ['https://buttons.github.io/buttons.js'],
    themeConfig: {
        navbar: {
            title: "eth2-docker Docs",
            logo: {
                alt: "Docker logo",
                src: 'img/Moby-logo.png',
            },
            items: [
                {
                    href: 'https://github.com/eth2-educators/eth2-docker',
                    label: 'Get Started',
                    position: 'right',
                }
            ],
        },
        footer: {
            logo: {
                alt: "eth2-docker Docs",
                href: '/',
                src: 'img/Moby-logo.png',
            },
            copyright: `Copyright © ${new Date().getFullYear()} Prysmatic Labs, LLC., Validator Deposit Contract 0x00000000219ab540356cbb839cbe05303d7705fa`,
            links: [],
        },
        algolia: {
            apiKey: 'd56b00e670b1ea4c44047c2d34807f6d',
            indexName: 'prysmaticlabs_prysm',
            algoliaOptions: {}
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    path: './docs',
                    routeBasePath: 'docs',
                    sidebarPath: require.resolve('./sidebars.json'),
                    editUrl: 'https://github.com/prysmaticlabs/documentation/edit/master/website/',
                },
                // theme: {
                //     customCss: require.resolve('./src/css/custom.css'),
                // },
                sitemap: {
                    cacheTime: 600 * 1000,
                    changefreq: 'weekly',
                    priority: 0.5,
                },
            },
        ],
    ],
};
