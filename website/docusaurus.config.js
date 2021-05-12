module.exports = {
    title: 'eth2-docker',
    tagline: 'Ethereum 2 Docker Client',
    url: 'https://github.com/eth2-educators/eth2-docker-docs',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/eth2-moby-logo.png',
    organizationName: 'Eth2 Docker',
    projectName: 'eth2-docker',
    customFields: {
        image: 'img/eth2-moby-logo.png',
    },
    scripts: ['https://buttons.github.io/buttons.js'],
    themeConfig: {
        navbar: {
            title: "eth2-docker Docs",
            logo: {
                alt: "eth2-docker logo",
                href: '/docs/About/Overview',
                src: 'img/eth2-moby-logo.png',
            },
            items: [
                {
                    href: 'https://github.com/eth2-educators/eth2-docker-docs',
                    label: 'Get Started',
                    position: 'right',
                }
            ],
        },
        footer: {
            logo: {
                alt: "eth2-docker logo",
                href: '/',
                src: 'img/eth2-moby-logo.png',
            },
            copyright: `Copyright © ${new Date().getFullYear()} eth2-docker contributors`,
            links: [],
        },
        algolia: {
            apiKey: '1cfe22495a6677d0769b41f971145ac6',
            indexName: 'eth2-docker',
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
                    editUrl: 'https://github.com/eth2-educators/eth2-docker-docs/edit/main/website/',
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
