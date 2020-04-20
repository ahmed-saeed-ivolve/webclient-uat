const routes = [
    {
        path: '/login',
        component: '../layouts/UserLayout',
        routes: [
            {
                path: '/login',
                component: './user/account',
            },
        ],
    },
    {
        path: '/mfa-login',
        component: './MfaLogin',
    },
    {
        path: '/notfound',
        component: './notFoundPage/NotFound',
    },
    {
        path: '/service',
        component: '../layouts/DetasadCloudLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['projectScope', 'unscoped'],
        routes: [
            {
                path: '/service',
                component: './service/_layout',
                authority: ['projectScope', 'unscoped'],
                routes: [
                    {
                        path: '/service/billing',
                        component: './billing/Dashboard',
                        authority: ['projectScope', 'unscoped'],
                    },
                    {
                        path: '/service/billing/spending-summary',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/SpendingSummary',
                    },
                    {
                        path: '/service/billing/invoices',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/Invoice',
                    },
                    {
                        path: '/service/billing/spend-by-service',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/CostByService',
                    },
                    {
                        path: '/service/billing/monthly-spend',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/MonthlySpend',
                    },
                    {
                        path: '/service/billing/analysis',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/Analysis',
                    },
                    {
                        path: '/service/billing/usage-details',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/UsageDetails',
                    },
                    {
                        path: '/service/billing/ecs-usage',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/EcsUsage',
                    },
                    {
                        path: '/service/billing/usage-report',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/UsageReportContainer',
                    },
                    {
                        path: '/service/billing/rate-mappings',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/RateMappings',
                    },
                    {
                        path: '/service/billing/pricing-plan',
                        authority: ['projectScope', 'unscoped'],
                        component: './billing/Cloud7PricingPlan',
                    },
                    {
                        path: '/service/compute/elastic-cloud-services',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/compute/ElasticCloudServices/ElasticCloudServices',
                    },
                    {
                        authority: ['projectScope', 'unscoped'],
                        path:
                            '/service/compute/elastic-cloud-services/show-instance',
                        component:
                            './service/compute/ElasticCloudServices/ECSDetails',
                    },
                    {
                        path: '/service/compute/elastic-cloud-services/create',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/compute/ElasticCloudServices/CreateECS',
                    },
                    {
                        path: '/service/compute/image-management-services',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/compute/ImageManagementServices/ImageManagementServices',
                    },
                    {
                        path:
                            '/service/compute/image-management-services/create',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/compute/ImageManagementServices/CreateIMS',
                    },
                    {
                        path:
                            '/service/compute/image-management-services/show-image',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/compute/ImageManagementServices/IMSDetails',
                    },
                    {
                        path: '/service/compute/flavors',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/compute/Flavors/Flavors',
                    },

                    {
                        path: '/service/compute/flavors/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/compute/Flavors/CreateFlavor',
                    },
                    {
                        path: '/service/compute/keypairs',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/compute/Keypairs/Keypairs',
                    },
                    {
                        path: '/service/compute/keypairs/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/compute/Keypairs/CreateKeypair',
                    },
                    {
                        path: '/service/network/networks',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/network/VirtualPrivateCloud/VirtualPrivateCloud',
                    },
                    {
                        path: '/service/network/networks/show-network',
                        component:
                            './service/network/VirtualPrivateCloud/VPCDetails',
                    },
                    {
                        path: '/service/network/networks/create',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/network/VirtualPrivateCloud/CreateVPC',
                    },
                    {
                        path: '/service/network/routers',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/Routers/Routers',
                    },
                    {
                        path: '/service/network/routers/show-router',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/network/Routers/RouterDetailsForEachElement',
                    },
                    {
                        path: '/service/network/routers/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/Routers/CreateRouter',
                    },
                    {
                        path: '/service/network/routers/add-interface',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/Routers/AddInterface',
                    },
                    {
                        path: '/service/network/security-groups',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/network/SecurityGroups/SecurityGroups',
                    },
                    {
                        path: '/service/network/security-groups/add-rule',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/SecurityGroups/AddRule',
                    },
                    {
                        path: '/service/network/security-groups/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/SecurityGroups/CreateSg',
                    },
                    {
                        path: '/service/network/floating-ips',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/FloatingIPs/FloatingIPs',
                    },
                    {
                        path: '/service/network/floating-ips/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/network/FloatingIPs/CreateFIP',
                    },
                    {
                        path: '/service/storage/elastic-volume-services',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/storage/ElasticVolumeServices/ElasticVolumeServices',
                    },
                    {
                        path: '/service/storage/snapshots',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/storage/SnapshotServices/Snapshots',
                    },
                    {
                        path: '/service/storage/snapshots/create',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/storage/SnapshotServices/CreateSnapshot',
                    },
                    {
                        path: '/service/storage/elastic-volume-services/create',
                        authority: ['projectScope', 'unscoped'],
                        component:
                            './service/storage/ElasticVolumeServices/CreateEVS',
                    },

                    // {
                    //     path: '/service/security/key-management-services',
                    //     authority: ['projectScope', 'unscoped'],
                    //     component:
                    //         './service/security/KeyManagementServices/KeyManagementServices',
                    // },
                    // {
                    //     path:
                    //         '/service/security/key-management-services/create',
                    //     authority: ['projectScope', 'unscoped'],
                    //     component:
                    //         './service/security/KeyManagementServices/CreateKMS',
                    // },
                    // {
                    //     authority: ['projectScope', 'unscoped'],
                    //     path:
                    //         '/service/security/key-management-services/show-key',
                    //     component:
                    //         './service/security/KeyManagementServices/KMSDetails',
                    // },
                    {
                        path: '/service/settings/flavors',
                        authority: ['domainScope', 'projectScope', 'unscoped'],
                        component: './service/settings/Flavors/Flavors',
                    },

                    {
                        path: '/service/settings/volumes',
                        authority: ['domainScope', 'projectScope', 'unscoped'],
                        component: './service/settings/Evs/Evs',
                    },

                    {
                        path: '/service/settings/flavors/create',
                        authority: ['domainScope', 'projectScope', 'unscoped'],
                        component: './service/settings/Flavors/CreateFlavor',
                    },
                    {
                        path: '/service/settings/volumes/create',
                        authority: ['domainScope', 'projectScope', 'unscoped'],
                        component: './service/settings/Evs/CreateEvsPricing',
                    },
                    {
                        path: '/service/iam/account',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Users/profiles/Userprofile',
                    },
                    {
                        path: '/service/iam/roles',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Roles/Roles',
                    },
                    {
                        path: '/service/iam/roles/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Roles/CreateRole',
                    },
                    {
                        path: '/service/iam/projects',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Tenants/Tenants',
                    },
                    {
                        path: '/service/iam/projects/show-project',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Tenants/TenantDetails',
                    },
                    {
                        path: '/service/iam/users/show-user',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Users/UserDetails',
                    },
                    {
                        path: '/service/iam/projects/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Tenants/CreateTenant',
                    },
                    {
                        authority: ['projectScope', 'unscoped'],
                        path: '/service/iam/users',
                        component: './service/iam/Users/Users',
                    },
                    {
                        path: '/service/iam/users/account',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Users/profiles/Userprofile',
                    },
                    {
                        path: '/service/iam/users/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Users/CreateUser',
                    },
                    {
                        path: '/service/iam/groups',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Groups/Groups',
                    },
                    {
                        path: '/service/iam/groups/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Groups/CreateGroup',
                    },
                    {
                        path: '/service/iam/roles',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Roles/Roles',
                    },
                    {
                        path: '/service/iam/roles/create',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Roles/CreateRole',
                    },
                    {
                        path: '/service/iam/groups/show-group',
                        authority: ['projectScope', 'unscoped'],
                        component: './service/iam/Groups/GroupDetails',
                    },
                ],
            },
        ],
    },
    {
        path: '/',
        Routes: ['src/pages/Authorized'],
        component: '../layouts/DetasadCloudLayout',
        routes: [
            {
                path: '/support',
                Routes: ['src/pages/Authorized'],
                component: './support/Support',
                authority: ['projectScope', 'unscoped'],
            },
            {
                path: '/',
                exact: true,
                component: './dashboard/analysis',
                authority: ['projectScope', 'unscoped'],
            },
        ],
    },

    {
        component: './404',
    },
];

export default routes;
