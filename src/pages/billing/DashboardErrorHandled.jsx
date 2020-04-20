import ErrorBoundar from '@/components/ErrorBoundary';
import Dashboard from './Dashboard';





const DashboardEB = props => {


return(
<ErrorBoundar>
    <Dashboard/>
</ErrorBoundar>
);


}
export default DashboardEB;