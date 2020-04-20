import { parse, stringify } from 'qs';
import { router } from 'umi';

import servicesMarkup from '@/utils/servicesMarkup';

const { categories } = servicesMarkup;

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

const resourceCreationFormsData = [
    {
        link: '/service/compute/elastic-cloud-services/create',
        title: 'Launch VM Instance',
        goBackTitle: 'Elastic Cloud Services',
    },
    {
        link: '/service/compute/image-management-services/create',
        title: 'Create Custom Images',
        goBackTitle: 'Image Management Services',
    },
    {
        link: '/service/compute/flavors/create',
        title: 'Create Flavors',
        goBackTitle: 'Flavors',
    },
    {
        link: '/service/compute/keypairs/create',
        title: 'Create Keypairs',
        goBackTitle: 'Elastic Cloud Services',
    },
    {
        link: '/service/security/key-management-services/create',
        title: 'Create Key',
        goBackTitle: 'Key Management Services',
    },
    {
        link: '/service/network/networks/create',
        title: 'Create Private Network',
        goBackTitle: 'Network',
    },
    {
        link: '/service/network/routers/create',
        title: 'Create Router',
        goBackTitle: 'Network',
    },
    {
        link: '/service/network/security-groups/create',
        title: 'Create Security Group',
        goBackTitle: 'Network',
    },
    {
        link: '/service/network/floating-ips/create',
        title: 'Create Elastic IP',
        goBackTitle: 'Network',
    },
    {
        link: '/service/storage/elastic-volume-services/create',
        title: 'Create Volume',
        goBackTitle: 'Volumes',
    },
    {
        link: '/service/storage/snapshots/create',
        title: 'Create Snapshot',
        goBackTitle: 'Snapshots',
    },
    {
        link: '/service/iam/projects/create',
        title: 'Create Project',
        goBackTitle: 'Tenants',
    },
    {
        link: '/service/iam/groups/create',
        title: 'Create Group',
        goBackTitle: 'Groups',
    },
    {
        link: '/service/iam/users/create',
        title: 'Create User',
        goBackTitle: 'Users',
    },
    {
        link: '/service/iam/roles/create',
        title: 'Create Role',
        goBackTitle: 'Roles',
    },

    {
        link: '/service/settings/flavors/create',
        title: 'Create Flavor Pricings',
        goBackTitle: 'Flavor',
    },
    {
        link: '/service/settings/volumes/create',
        title: 'Create Evs Pricings',
        goBackTitle: 'evs',
    },
];

const Model = {
    namespace: 'serviceLayout',
    state: {
        sideBar: {},
        selectedSubService: {},
    },

    reducers: {
        update(state, { payload }) {
            const {
                selectedCategory,
                selectedRoute,
                type,
                typeDetailed,
            } = payload;

            const categoryLinks = categories[selectedCategory];

            const { icon, service } = categoryLinks;

            const menu = Object.entries(service).reduce(
                (acc, value) => [...acc, { title: value[0], ...value[1] }],
                []
            );

            let selectedSubService;

            if (type === 'listView') {
                selectedSubService = {
                    type,
                    ...menu.find(item =>
                        item.child
                            ? item.child.find(
                                  childItem => childItem.link === selectedRoute
                              )
                            : item.link === selectedRoute
                    ),
                };
                if (selectedSubService.child) {
                    selectedSubService = {
                        type,
                        ...selectedSubService.child.find(
                            item => item.link === selectedRoute
                        ),
                    };
                }
            } else if (type === 'createView') {
                selectedSubService = {
                    type,
                    ...resourceCreationFormsData.find(
                        item => item.link === selectedRoute
                    ),
                };
            } else if (type === 'detailsView') {
                selectedSubService = {
                    type,
                    typeDetailed,
                    ...resourceCreationFormsData.find(
                        item => item.link === selectedRoute
                    ),
                };
            } else if (type === 3) {
                selectedSubService = {
                    type,
                    ...menu.find(item => selectedRoute.includes(item.link)),
                };
            } else if (type === 4) {
                selectedSubService = {
                    type,
                    ...menu.find(item => selectedRoute.includes(item.link)),
                };
            } else if (type === 6 || type === 7) {
                selectedSubService = {
                    type,
                    ...menu.find(item => selectedRoute.includes(item.link)),
                };
            }

            const sideBar = {
                selectedCategory,
                icon,
                menu,
            };

            return {
                ...state,
                sideBar,
                selectedSubService,
            };
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, search }) => {
                if (pathname.includes('/service/') && pathname) {
                    let selectedCategory = null;

                    let typeDetailed = null;
                    let type = 'listView';

                    if (pathname.includes('/service/compute')) {
                        selectedCategory = 'Compute';

                        if (pathname.includes('show-instance')) {
                            type = 3;
                        }
                    } else if (pathname.includes('/service/storage')) {
                        selectedCategory = 'Storage';
                    } else if (pathname.includes('/service/settings')) {
                        selectedCategory = 'Settings';
                    } else if (pathname.includes('/service/security')) {
                        selectedCategory = 'Security';
                        if (pathname.includes('show-key')) {
                            type = 7;
                        }
                    } else if (pathname.includes('/service/network')) {
                        selectedCategory = 'Networking';
                        if (pathname.includes('show-network')) {
                            type = 6;
                        }
                    } else if (pathname.includes('/service/iam')) {
                        selectedCategory = 'IAM';
                        if (pathname.includes('account')) {
                            type = 4;
                        } else if (pathname.includes('show-group')) {
                            (type = 'detailsView'), (typeDetailed = 'groups');
                        } else if (pathname.includes('show-project')) {
                            (type = 'detailsView'), (typeDetailed = 'projects');
                        }
                    } else if (pathname.includes('/service/billing')) {
                        selectedCategory = 'Billing';
                    }

                    if (pathname.includes('/create')) {
                        type = 'createView';
                    }

                    dispatch({
                        type: 'update',
                        payload: {
                            selectedCategory,
                            selectedRoute: pathname,
                            type,
                            typeDetailed,
                        },
                    });
                }
            });
        },
    },
};

export default Model;
