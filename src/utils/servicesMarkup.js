const services = {
    categories: {
        Compute: {
            icon: 'cloud-server',
            service: {
                'Elastic Compute Server': {
                    icon: 'cloud',
                    link: '/service/compute/elastic-cloud-services',
                    description: `Launch, configure & manage VM instances in the cloud`,
                    modelName: 'ecs',
                },

                'Image Management Service': {
                    icon: 'copy',
                    link: '/service/compute/image-management-services',
                    description: 'Handle your images',
                    modelName: 'ims',
                },
                Flavors: {
                    icon: 'experiment',
                    link: '/service/compute/flavors',
                    description: 'All flavors of images',
                    modelName: 'flavor',
                },
                Keypairs: {
                    icon: 'api',
                    link: '/service/compute/keypairs',
                    description: 'Assign unique keypairs',
                    modelName: 'keypair',
                },
            },
        },
        Storage: {
            icon: 'code-sandbox',
            service: {
                'Elastic Volume Service': {
                    icon: 'cloud-upload',
                    link: '/service/storage/elastic-volume-services',
                    description: 'Attach volumes to your VMs',
                    modelName: 'evs',
                },
                Snapshots: {
                    icon: 'database',
                    link: '/service/storage/snapshots',
                    description: 'Save what you have done',
                    modelName: 'snapshot',
                },
            },
        },

        Security: {
            icon: 'unlock',
            service: {
                'Key Management Service (KMS)': {
                    icon: 'key',
                    link: '/service/security/key-management-services',
                    description: 'Encryption and decryption of data',
                    modelName: 'kms',
                },
            },
        },

        Networking: {
            icon: 'cluster',
            service: {
                Networks: {
                    icon: 'cluster',
                    link: '/service/network/networks',
                    description: 'Build your own private network',
                    modelName: 'vpc',
                },
                Routers: {
                    icon: 'global',
                    link: '/service/network/routers',
                    description: 'Assign routers to networks',
                    modelName: 'router',
                },
                'Security Groups': {
                    icon: 'usergroup-add',
                    link: '/service/network/security-groups',
                    description: 'Provide security groups to networks',
                    modelName: 'securitygroup',
                },
                'Elastic IP': {
                    icon: 'gateway',
                    link: '/service/network/floating-ips',
                    description: 'Assign a public IP to your network',
                    modelName: 'floatingip',
                },
            },
        },
        IAM: {
            icon: 'team',
            service: {
                Account: {
                    icon: 'idcard',
                    link: '/service/iam/account',
                    description: 'User detail',
                },

                Projects: {
                    icon: 'apartment',
                    link: '/service/iam/projects',
                    description: 'Projects in cloud',
                    modelName: 'projects',
                },
                Groups: {
                    icon: 'usergroup-add',
                    link: '/service/iam/groups',
                    description: 'Groups in cloud',
                    modelName: 'groups',
                },
                Users: {
                    icon: 'user-add',
                    link: '/service/iam/users',
                    description: 'Users in cloud',
                    modelName: 'users',
                },
                Roles: {
                    icon: 'solution',
                    link: '/service/iam/roles',
                    description: 'Roles in cloud.',
                    modelName: 'roles',
                },
            },
        },
        Settings: {
            icon: 'apartment',
            service: {
                Flavors: {
                    icon: 'experiment',
                    link: '/service/settings/flavors',
                    description: 'Flavor pricings detail',
                    modelName: 'flavor',
                },

                'Elastic Volume Service': {
                    icon: 'code-sandbox',
                    link: '/service/settings/volumes',
                    description: 'EVS pricings detail',
                    modelName: 'evs',
                },
            },
        },
        Billing: {
            icon: 'block',
            service: {
                'Usage Report': {
                    title: 'Usage Report',
                    icon: 'apartment',
                    link: '/service/billing/usage-report',
                    description: 'Check out your cloud usage here',
                },
            },
        },
    },

    Others: {
        'Identity Access Management': {
            icon: '',
            link: '/identity-access-management',
            description: 'Assign a public IP To Your Network',
        },

        Support: {
            icon: '',
            link: '/support',
        },
    },
};

export default services;
