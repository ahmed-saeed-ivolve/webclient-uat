import moment from 'moment';
const y = [{ name: 'instance' }, { name: 'volume.size' }, { name: 'ip.floating' }];
const x = [
  {
    summary: [
      {
       

        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'instance',
        rate: '110.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'ip.floating',
        rate: '16.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'volume.size',
        rate: '7.0',
        end: '2019-09-30T00:00:00+00:00',
      },
    ],
  },
  {
    summary: [
      {
       

        tenant_id: 'ALL',
        begin: '2019-08-01T00:00:00+00:00',
        res_type: 'instance',
        rate: '110.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-08-01T00:00:00+00:00',
        res_type: 'ip.floating',
        rate: '16.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-08-01T00:00:00+00:00',
        res_type: 'volume.size',
        rate: '7.0',
        end: '2019-09-30T00:00:00+00:00',
      },
    ],
  },
  {
    summary: [
      {
       

        tenant_id: 'ALL',
        begin: '2019-07-01T00:00:00+00:00',
        res_type: 'instance',
        rate: '89',
        end: '2019-07-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-07-01T00:00:00+00:00',
        res_type: 'ip.floating',
        rate: '16.99',
        end: '2019-07-30T00:00:00+00:00',
      },
     
     
     
     
     
     
     
    ],
  },
  {
    summary: [],
  },
];

export const getUsageReportFileName = fileExtension => {
  const dateText = moment().format('MM-DD-YYYY');
  return `usage_report_${dateText}.${fileExtension}`;
};

export function transform(data) {
  try {
    return data.reduce((acc, summaryItem, index, arr) => {
      const { summary } = summaryItem;

      if (summary.length > 0) {
        const retArr = acc.map(service => {
          const month = moment(summary[0].begin).format('MMMM');

          const { name } = service;

          const thisSummaryObject = summary.find(sumService => {
            return sumService.res_type === name;
          });

          const rate = thisSummaryObject ? thisSummaryObject.rate : 0;

          return {
            ...service,
            [month]: Number(rate),
          };
        });
        return retArr;
      } else {
        const month = moment()
          .subtract(arr.length - 1 - index, 'months')
          .format('MMMM');
        return acc.map(service => {
          return {
            ...service,
            [month]: 0,
          };
        });
      }
    }, y);
  } catch (e) {
    console.error(e.message);
   
    return [
      {
        name: 'volume.size',
        'Mar.': 0.3,
        'Apr.': 1.4,
        May: 1,
        'Jun.': 1.3,
        'Jul.': 0,
        'Aug.': 0.6,
      },
      {
        name: 'image.size',
        'Mar.': 1.5,
        'Apr.': 1.7,
        May: 1.6,
        'Jun.': 1.5,
        'Jul.': 1.4,
        'Aug.': 1.4,
      },
      {
        name: 'instance',
        'Mar.': 1.3,
        'Apr.': 1.4,
        May: 1,
        'Jun.': 1.3,
        'Jul.': 1,
        'Aug.': 1.6,
      },
      {
        name: 'floating.ip',
        'Mar.': 1.5,
        'Apr.': 1.7,
        May: 1.6,
        'Jun.': 1.5,
        'Jul.': 1.4,
        'Aug.': 1.4,
      },
    ];
  }
}
