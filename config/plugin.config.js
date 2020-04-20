import ThemeColorReplacer from 'webpack-theme-color-replacer';
import generate from '@ant-design/colors/lib/generate';
import path from 'path';

function getModulePackageName(module) {
    if (!module.context) return null;
    const nodeModulesPath = path.join(__dirname, '../node_modules/');

    if (
        module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath
    ) {
        return null;
    }

    const moduleRelativePath = module.context.substring(nodeModulesPath.length);
    const [moduleDirName] = moduleRelativePath.split(path.sep);
    let packageName = moduleDirName;

    if (packageName && packageName.match('^_')) {
        packageName = packageName.match(/^_(@?[^@]+)/)[1];
    }

    return packageName;
}

export default config => {
    if (
        process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ===
            'site' ||
        process.env.NODE_ENV !== 'production'
    ) {
        config.plugin('webpack-theme-color-replacer').use(ThemeColorReplacer, [
            {
                fileName: 'css/theme-colors-[contenthash:8].css',
                matchColors: getAntdSerials('#1890ff'),

                changeSelector(selector) {
                    switch (selector) {
                        case '.ant-calendar-today .ant-calendar-date':
                            return (
                                ':not(.ant-calendar-selected-date)' + selector
                            );

                        case '.ant-btn:focus,.ant-btn:hover':
                            return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)';

                        case '.ant-btn.active,.ant-btn:active':
                            return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)';

                        default:
                            return selector;
                    }
                },
            },
        ]);
    }

    config.optimization.runtimeChunk(false).splitChunks({
        chunks: 'all',
        name: 'vendors',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
            vendors: {
                test: module => {
                    const packageName = getModulePackageName(module);

                    if (packageName) {
                        return (
                            ['bizcharts', '@antv_data-set'].indexOf(
                                packageName
                            ) >= 0
                        );
                    }

                    return false;
                },

                name(module) {
                    const packageName = getModulePackageName(module);

                    if (packageName) {
                        if (
                            ['bizcharts', '@antv_data-set'].indexOf(
                                packageName
                            ) >= 0
                        ) {
                            return 'viz';
                        }
                    }

                    return 'misc';
                },
            },
        },
    });
};

const getAntdSerials = color => {
    const lightNum = 9;
    const devide10 = 10;

    const lightens = new Array(lightNum).fill(undefined).map((_, i) => {
        return ThemeColorReplacer.varyColor.lighten(color, i / devide10);
    });
    const colorPalettes = generate(color);
    return lightens.concat(colorPalettes);
};
