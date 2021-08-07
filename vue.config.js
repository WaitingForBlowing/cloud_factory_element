module.export = {
    configureWebpack: {
        resolve: {
            alias: {
                assets: '@/assets',
                components: '@/components',
                views: '@/views'
            }
        }
    }
}
