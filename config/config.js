import defaultSettings from './defaultSettings';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import routes from './routes';
const { pwa, primaryColor } = defaultSettings;

const {
    IP_ADDR,
    BEFFE,
    ORCH,
    IAM,
    API_GATEWAY,
    CLOUDFOR,
    EMAILER,
    MONITORING_SOCKET_IP,
    RELEASE_VERSION,
    BUILD_NUMBER,
    DEVELOPMENT_ENV,
} = process.env;

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview =
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                enable: true,


                default: 'en-US',

                baseNavigator: true,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 5,
            },
            pwa: pwa
                ? {
                      workboxPluginMode: 'InjectManifest',
                      workboxOptions: {
                          importWorkboxFrom: 'local',
                      },
                  }
                : false,
        },
    ],
    [
        'umi-plugin-pro-block',
        {
            moveMock: false,
            moveService: false,
            modifyRequest: true,
            autoAddMenu: true,
        },
    ],
];

if (isAntDesignProPreview) {
    plugins.push([
        'umi-plugin-ga',
        {
            code: 'UA-72788897-6',
        },
    ]);
    plugins.push([
        'umi-plugin-pro',
        {
            serverUrl: 'https://ant-design-pro.netlify.com',
        },
    ]);
}

export default {
    plugins,
    block: {
        defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
    },
    hash: true,
    targets: {
        ie: 11,
    },
    devtool: isAntDesignProPreview ? 'source-map' : false,

    routes,

    theme: {
        'primary-color': primaryColor,
        'body-background': `#f0f2f5`,
    },
    define: {
        RELEASE_VERSION,
        BUILD_NUMBER,
        EMAILER,
        DEVELOPMENT_ENV,
        BEFFE,
        ORCH,
        CLOUDFOR,
        IAM,
        API_GATEWAY,
        MONITORING_SOCKET_IP,
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
            ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || true,
    },
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    disableRedirectHoist: true,
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, _, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }

            const match = context.resourcePath.match(/src(.*)/);

            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map(a => a.replace(/([A-Z])/g, '-$1'))
                    .map(a => a.toLowerCase());
                return `antd-pro${arr.join('-')}-${localName}`.replace(
                    /--/g,
                    '-'
                );
            }

            return localName;
        },
    },
    manifest: {
        basePath: '/',
    },

    chainWebpack: webpackPlugin,
};
