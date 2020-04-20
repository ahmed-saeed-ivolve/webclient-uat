export default {
    apiPrefix: `${BEFFE}`,

    endpoints: {
        ecs: `/instances_list`,
        flavor: `/flavor`,
        keypair: `/keypair`,
        ims: `/images`,
        vpc: `/network`,
        router: `/router`,
        securitygroup: `/security_group`,
        floatingip: `/floating_ip`,
        evs: `/volume`,
        tenant: `/projects`,

        role: `/roles`,
        user: `/users`,
        generic_backend: `/orchestrator-router`,
        subnet: `/subnet`,
        stats: `/stats`,
    },
};
