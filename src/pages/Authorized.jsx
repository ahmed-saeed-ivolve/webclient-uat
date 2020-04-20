import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';



const getRouteAuthority = (path, routeData) => {

  let authorities;

 
  routeData.forEach(route => {

   

    if (pathToRegexp(`${route.path}(.*)`).test(path)) {

     

      if (route.path === path) {
        authorities = route.authority || authorities;
      }

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });


  return authorities;
};


const AuthComponent = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
 
}) => {




 
 
  const { routes = [] } = route;

 
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={<Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
};






export default AuthComponent