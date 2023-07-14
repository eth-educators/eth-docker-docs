module.exports = {
    title: 'eth-docker',
    tagline: 'Ethereum  Docker Client',
    url: 'https://eth-docker.net',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/eth-moby-logo.png',
    organizationName: 'Eth Docker',
    projectName: 'eth-docker',
    customFields: {
        image: 'img/eth-moby-logo.png',
    },
    scripts: ['https://buttons.github.io/buttons.js'],
    themeConfig: {
        navbar: {
            title: "eth-docker Docs",
            logo: {
                alt: "eth-docker logo",
                href: '/',
                src: 'img/eth-moby-logo.png',
            },
            items: [
                {
                    href: '/',
                    label: 'Get Started',
                    position: 'right',
                }
            ],
        },
        footer: {
            logo: {
                alt: "eth-docker logo",
                href: '/',
                src: 'img/eth-moby-logo.png',
            },
            copyright: `Copyright © ${new Date().getFullYear()} eth-docker contributors`,
            links: [],
        },
        algolia: {
            appId: '0ADJW6A3YH',
            apiKey: 'ac048855a81596948b9d8386b6ccc0c1',
            indexName: 'eth2-docker',
            searchParameters: { 'facetFilters': ["type:content", "version:current"] }
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    path: './docs',
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.json'),
                    editUrl: 'https://github.com/eth-educators/eth-docker-docs/edit/main/website/',
                },
                // theme: {
                //     customCss: require.resolve('./src/css/custom.css'),
                // },
                sitemap: {
                    changefreq: 'weekly',
                    priority: 0.5,
                },
            },
        ],
    ],
};
