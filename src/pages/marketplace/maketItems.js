let marketItem = [
  {
    title: 'WordPress',

    description: 'Web publishing platform for building multiple blogs and websites',
    image_id: '55d3fa82-7ab5-489e-a679-70dd08131f66',
    owner: 'Google Click To Deploy',
    tag: ['CMS', 'Blogging', 'Website'],
  },
  {
    title: 'SAP HANA, express edition (server + applications)',
    avatar:
      '//d33np9n32j53g7.cloudfront.net/assets/stacks/magento/img/magento-stack-110x117-c926dc3bf1430d78fc4e6c417ba7b4523c6516060284c796df7eb28e9491b41a.png',

    description: ' In-memory Platform for Business Digital Transformation ',
    owner: 'SAP',
    tag: ['Database', 'Developer Stacks'],
  },
  {
    title: 'NVIDIA Quadro Virtual Workstation - Windows Server 2019',
    avatar:
      'https://lh3.googleusercontent.com/8qgSwZhnnJM96DnEs9_VctVy1bedAJl1lCADIk9ycWuyQcfTG0Vqsa30izOHfS_mtI6t5bUMR2YmpTdnLV2y',
    description: ' GPU-Accelerated Cloud Computing ',
    owner: 'NVIDIA',
    tag: ['Compute', 'Operating System'],
  },
  {
    title: 'VM-Series Next-Generation Firewall Bundle 2',
    avatar:
      'https://lh3.googleusercontent.com/fz1jYjXCkgd8ND_S68BPr-IR_QGNIv6fI70avKNX5vU_9JE6VPFtGgujME0e5utSUjaxKJJPKCkR8sM7vQ0',
    description: ' Next-Generation Firewall from Palo Alto Networks ',
    owner: 'Palo Alto Networks, Inc.',
    tag: ['Networking', 'Security', 'Virtual Machines'],
  },
  {
    title: 'NGINX Plus - Ubuntu 16.04',
    avatar:
      'https://lh3.googleusercontent.com/CbCeAqt7a5OPS66DyQYBChm3hmgf-_K9z6QPMP5iS3oP5HogurkKm9lk6rf-J8Ux_dXt1uYjWly23ysjc3c',
    description: ' Load balancing, acceleration and high availability for web apps ',
    owner: 'NGINX, Inc',
    tag: ['Virtual Machines', 'Networking'],
  },
  {
    title: 'Sahaba Compute Service',
    avatar:
      'https://lh3.googleusercontent.com/WT82V3xPYoRVfL-w805ClsX8Z4J35PGhtp6j04F18JlTXs7IqOZBzepeANi7B2ZWliFyCXcxq8xtfSsp1EYx',
    description: ' Scalable, high-performance virtual machines ',
    owner: 'Sahaba Cloud',
    tag: ['Compute', 'Sahaba Cloud'],
  },
  {
    title: 'Sahaba Kubernetes Service',
    avatar:
      'https://lh3.googleusercontent.com/Aane0AssTO_QZK7MZ3yV89oPg95K5LgJ7Keang1B9Vi1DEMWG4vTUqBewXM3ibwZdEO0IW1NnumogaGOZVwf',
    description: ' One-click Kubernetes clusters, managed by Google ',
    owner: 'Sahaba Cloud',
    tag: ['Compute', 'Engine', 'Sahaba Cloud'],
  },
  {
    title: 'Cloud Automation Stack',
    avatar:
      'https://lh3.googleusercontent.com/stb3E6s9o09DZl5e27lxDbLchw6_62NXkpgC3tk2NknFkxb3nqVJH61hSN4JfPHs2O-JjVoUsvQvaTQ1lsA',
    description: ' Making VDI simple on Sahaba Cloud ',
    owner: 'itopia',
    tag: ['Apis & Services', 'Compute', 'Networking'],
  },
  {
    title: 'Windows Server 2016',
    avatar:
      'https://lh3.googleusercontent.com/84Vmaf5e1ljoDSSQtCadVCGrQRtpLI4ND5goCrrFaWgdCF5j1NqzxEJgnNlbhAkbxWm8J8nzYYFq_CE_TsDt',
    description: ' Windows Server 2016 Datacenter Edition ',
    owner: 'Microsoft',
    tag: ['Operating System', 'Virtual Machines'],
  },
  {
    title: 'Red Hat Enterprise Linux 7',
    avatar:
      'https://lh3.googleusercontent.com/mFKlg-wloU7bykwVQXdqBrXIuH_9I2B8RkgCRf1_XiMezE1j_kMLkK1SC0_6KYfHKdICluDaXXWRyI5U48c0Jw',
    description: ' Red Hat Enterprise Linux 7 ',
    owner: 'Red Hat',
    tag: ['Operating System', 'Virtual Machines'],
  },
  {
    title: 'AppScale',
    avatar:
      'https://lh3.googleusercontent.com/NDZ-OVWLmh2AYMPcM2qR8XGOQazRm1SF0L9eugKPHrH-1uUeM69BkrPKkN4feZTGNrX60ammBeRxpMe0F71YLw',
    description: ' Open Source Google App Engine ',
    owner: 'AppScale',
    tag: ['Developer Stacks', 'Scaling', 'Infrastructure'],
  },
  {
    title: 'Memcached Certified by Bitnami',
    avatar:
      'https://lh3.googleusercontent.com/__cbyCkmfCHARrI_4KgVbWN0YY9Zs1jIg72zddBvOmadHeGSw5jPgGtojwE4pB1UuPC4R-uKDNvoon350Lc7',
    description: ' Up-to-date, secure, and ready to run. ',
    owner: 'Bitnami',
    tag: ['Developer tools', 'Developer Stacks'],
  },
  {
    title: 'Connect',
    avatar:
      'https://lh3.googleusercontent.com/qs3PLkSsVD1UGUr6voHkHbFO7vJL41GjTE9k7_Fi8P1kzHAOtfEEuGqvqBolXwIRTjxA4ajckTwTEH26G2Qf',
    description: ' All-in-one website security ',
    owner: 'Shape Security',
    tag: ['CMS'],
  },
  {
    title: 'MongoDB Atlas',
    avatar:
      'https://lh3.googleusercontent.com/LNVTA-IDj8YdyBxixCnHU-jPFyL1crWdc6ludh1iuF32Yl2zQ15CpTu7PKw4GzMRyHBDrKyUCSkfa_vsIves',
    description: ' Set up, scale, and operate MongoDB with just a few clicks ',
    owner: 'MongoDB Inc.',
    tag: ['CMS'],
  },
  {
    title: 'Black Duck by Synopsys',
    avatar:
      'https://lh3.googleusercontent.com/N-hZlRChaUvsIfYYqTmoPqDGMcnbgmoTx443UYUDOT9GZuKt4objQn5EtPru8xQ0eb9bAsmcq36yqHVOElYXZA',
    description: ' Secure and Manage Open Source use in Applications and Containers ',
    owner: 'Synopsys',
    tag: ['CMS'],
  },
  {
    title: 'Appspace Cloud',
    avatar:
      'https://lh3.googleusercontent.com/lY1SiNAJy5jokj-Id-AA5PkMZui2AdNuEh2cmCtfG3iBEt0tdnNGM_Z2mmVA6_xnhZJWxQe96lWUyA_81YgR_Q',
    description: ' A platform to keep teams informed in the workplace and on the go ',
    owner: 'Appspace',
    tag: ['CMS'],
  },
];
export default marketItem;
