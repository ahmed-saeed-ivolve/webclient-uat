import { request, requestOrchestrator } from '@/utils/request';
import { generic_backend } from '@/pages/service/services/generic_service';
export async function queryAvailabilityZone() {
    return await requestOrchestrator(
        `${generic_backend}?method=Compute.availability_zones`,
        {
            method: 'post',
        },
        `${ORCH}`
    );
}

export async function queryMonthlySpend(payload) {
    if (payload.groupby)
        return await request(
            `/monthly-spend/${payload.num_months}?groupby=${payload.groupby}`,
            {
                method: 'get',
            },
            `${BEFFE}`
        );
    else
        return await request(
            `/monthly-spend/${payload.num_months}`,
            {
                method: 'get',
            },
            `${BEFFE}`
        );
}

export async function querySpendByService(payload) {
    return await request(
        `/spend-by-service?begin=${payload.begin}&end=${payload.end}`,
        {
            method: 'get',
        },
        `${BEFFE}`
    );
}
