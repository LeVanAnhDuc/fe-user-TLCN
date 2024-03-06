import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { Fragment } from 'react';
import { publishRoute, privateRoute } from './routes';
import { DefaultLayout } from './layouts';
import ScrollAutoTop from './components/ScrollAutoTop';
import { useAppSelector } from './redux/hook';
import { selectIsLogin } from './pages/LogIn/loginSlice';

function App() {
    const isLogin = useAppSelector(selectIsLogin);

    return (
        <>
            {(isLogin && (
                <Router>
                    <ScrollAutoTop />
                    <div className="App">
                        <Routes>
                            {publishRoute.map((item, index) => {
                                const Layout = item.layout === null ? Fragment : item.layout || DefaultLayout;

                                const Element = item.component;
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={
                                            <Layout>
                                                <Element />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </div>
                </Router>
            )) || (
                <Router>
                    <ScrollAutoTop />
                    <div className="App">
                        <Routes>
                            {privateRoute.map((item, index) => {
                                const Layout = item.layout === null ? Fragment : item.layout || DefaultLayout;

                                const Element = item.component;
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={
                                            <Layout>
                                                <Element />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </div>
                </Router>
            )}

            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
            />
        </>
    );
}

export default App;
