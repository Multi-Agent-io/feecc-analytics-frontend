import './App.css';
import './i18n'
import {useEffect} from "react";
import {getAuthorizationStatus} from "./store/selectors";
import {history} from "./store/main";
import {doFetchUser} from "./store/userActions";import {useDispatch, useSelector} from "react-redux";
import Sidebar from "./components/Sidebar/Sidebar";
import Passports from "./pages/Passports/Passports";
import UnderConstruction from "./pages/UnderConstruction/UnderConstruction";
import Login from "./pages/Login/Login";
import Passport from "./pages/Passport/Passport";

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
        // ['^/employees', () => <Employees/>],
        ['^/employees', () => <UnderConstruction/>],
        // ['^/production-schemas', () => <Schemas/>],
        ['^/production-schemas', () => <UnderConstruction/>],
        ['^/passport/*', () => <Passport>test</Passport>]

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
                        console.log('Error while fetching user. Res.status !== 200')
                    }
                })
                .catch((err) => {
                })
        }
        if(!authorized) {
            if(localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null)
                doFetchUser(dispatch).then((res) => {
                    if(res.status === 200 && location === '/') {
                        history.push('/passports')
                    } else if (res.status === 401) {
                        history.push('/')
                    }
                })
            else {
                if(location !== '/') {
                    console.log('FORCE REDIRECT')
                    history.push('/')
                }
            }
        }
    })
  return (
    <div className="App">
        {location !== '/' && (<Sidebar/>)}
        {route(location)}
    </div>
  );
}

export default App;