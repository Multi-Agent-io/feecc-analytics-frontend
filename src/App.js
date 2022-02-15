import './App.css';
import './i18n'
import {useEffect} from "react";
import {getAuthorizationStatus} from "./store/selectors";
import {history} from "./store/main";
import {doFetchUser} from "./store/userActions";import {useDispatch, useSelector} from "react-redux";
import ModalProvider from './store/ModalProvider';


import Sidebar from "./components/Sidebar/Sidebar";
import Passports from "./pages/Passports/Passports";
import Protocol from "./pages/Protocol/Protocol"
import UnderConstruction from "./pages/UnderConstruction/UnderConstruction";
import Login from "./pages/Login/Login";
import Passport from "./pages/Passport/Passport";
import TechnicalControlDepartment from './pages/TechnicalControlDepartment/TechnicalControlDepartment'
import ScanModal from './pages/ScanModal/ScanModal';
import ConfirmModal from './pages/ConfirmModal/ConfirmModal';

// import Schemas from "./pages/Schemas/Schemas";
// import Employees from "./pages/Employees/Employees";

function App() {
    let authorized = useSelector(getAuthorizationStatus)
    let dispatch = useDispatch()
    let location = useSelector(state => state.router.location.pathname)
    let routes = [
        ['^/$', () => <Login/>],
        ['^/passports', () => <Passports/>],
        // ['^/Passports', () => <UnderConstruction/>],
        ['^/tcd/protocol/*', () => <Protocol/>],
        ['^/tcd', () => <TechnicalControlDepartment/>],
        // ['^/tcd', () => <UnderConstruction/>],
        // ['^/employees', () => <Employees/>],
        ['^/employees', () => <UnderConstruction/>],
        // ['^/production-schemas', () => <Schemas/>],
        ['^/production-schemas', () => <UnderConstruction/>],
        ['^/passport/*', () => <Passport/>],
        

    ]
    let route = (path) => routes.find(r => path.match(r[0]) !== null)?.[1]?.()
    

    useEffect(() => {
        if(authorized && localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null) {
            doFetchUser(dispatch)
                .then((res) => {
                    if (res.status === 200 && location === '/') {
                        history.push('/passports')
                    } else if (res.status === 401) {
                        history.push('/')
                    }
                })
                .catch((err) => {
                    if(err.response.status === 401)
                        history.push('/')
                })
        }
        if(!authorized) {
            if(localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null)
                doFetchUser(dispatch).then((res) => {
                    if(res.status === 200 && location === '/') {
                        history.push('/passports')
                    }
                }).catch((err) => {
                    if(err.response.status === 401 && location !== '/')
                        history.push('/')
                })
            else {
                if(location !== '/') {
                    localStorage.setItem('tablePage', '1')
                    history.push('/')
                }
            }
        }
    })
  return (
    <ModalProvider>
        <ScanModal/>
        <ConfirmModal/>
        <div className="App">
            {location !== '/' && (<Sidebar/>)}
            {route(location)}
        </div>
    </ModalProvider>
  );
}

export default App;