import React, { Suspense } from 'react';
import detasadLogo from '@/assets/logo_2.png';
import cloud7Logo from '@/assets/cloud7topbar.png';
import { Link } from 'umi';

const whichLogo = {
    detasad: detasadLogo,
    cloud7: cloud7Logo,
};
const DetasadLogoHolder = ({ width, style }) => {
    return (
        <Link style={{ ...style }} to="/">
            <img src={whichLogo[CLOUDFOR]} width={`${width}px`} alt="logo" />
        </Link>
    );
};

export default DetasadLogoHolder;
