import 'animate.css';
import '../styles/globals.css';
import "../styles/globals.scss";
//import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContext} from "../ContextAPI/Auth-context";
import {UseAuth} from "../ContextAPI/customHook/UseAuth";

function MyApp({ Component, pageProps }) {
  const {  valueAccount, login, logout, update, getIdBlog} = UseAuth();
  
  return (
    <AuthContext.Provider
      value={{
        accountId: valueAccount.accountId,
        name: valueAccount.name,
        avatar: valueAccount.avatar,
        role: valueAccount.role,
        login: login,
        logout: logout,
        update: update,
        getIdBlog: getIdBlog,
        idBlog: valueAccount.idBlog,
        idUpdate: valueAccount.idUpdate,
        TTupdate: valueAccount.TTupdate
      }}
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp
