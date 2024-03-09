import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material/';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { publishRoute, privateRoute } from './routes';
import { DefaultLayout } from './layouts';
import ScrollAutoTop from './components/ScrollAutoTop';
import { useAppSelector } from './redux/hook';
import { selectIsLogin } from './pages/LogIn/loginSlice';
import { selectIsTheme } from './components/SpeedDialSettingUI/themeSlice';

function App() {
    const isLogin = useAppSelector(selectIsLogin);

    const storedTheme = useSelector(selectIsTheme);
    const [theme, setTheme] = useState(
        createTheme({
            palette: {
                mode: storedTheme === 'light' ? 'light' : 'dark',
            },
        }),
    );

    useEffect(() => {
        setTheme(
            createTheme({
                palette: {
                    mode: storedTheme === 'light' ? 'light' : 'dark',
                },
            }),
        );
    }, [storedTheme]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isLogin ? (
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
            ) : (
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
        </ThemeProvider>
    );
}

export default App;
