import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core';
import LoadingBar from 'react-redux-loading-bar';

import APIErrorModal from './components/APIErrorModal';
import Login from './routes/User/Login';
import Expenses from './routes/Expenses';
import ExpenseEdit from './routes/Expenses/Edit';
import Dashboard from './routes/Dashboard';
import ExpenseCreate from './routes/Expenses/Create';
import PrivateRoute from './components/PrivateRoute';
import BasePage from './components/BasePage';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Encode Sans Expanded, sans-serif',
    },
    palette: {
        common: { black: '#000', white: '#fff' },
        background: { paper: '#fff', default: '#fafafa' },
        primary: {
            light: 'rgba(142, 172, 187, 1)',
            main: 'rgba(96, 125, 139, 1)',
            dark: 'rgba(52, 81, 94, 1)',
            contrastText: '#fff',
        },
        secondary: {
            light: 'rgba(188, 156, 141, 1)',
            main: 'rgba(139, 110, 96, 1)',
            dark: 'rgba(93, 67, 54, 1)',
            contrastText: '#fff',
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff',
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
        },
    },
});

function App() {
    const apiError = useSelector((state) => state.common.apiError);
    const dispatch = useDispatch();
    const close = () => dispatch({ type: 'CLEAR_API_ERROR' });

    return (
        <ThemeProvider theme={theme}>
            <header>
                <LoadingBar />
            </header>

            <CssBaseline />
            <APIErrorModal
                code={apiError ? apiError.code : null}
                messages={apiError ? apiError.messages : []}
                open={apiError !== null}
                onClose={close}
            ></APIErrorModal>

            <Switch>
                <PrivateRoute exact path="/reports">
                    <Dashboard />
                </PrivateRoute>
                <PrivateRoute exact path="/expenses">
                    <Expenses />
                </PrivateRoute>
                <PrivateRoute exact path="/expenses/new">
                    <ExpenseCreate />
                </PrivateRoute>
                <PrivateRoute exact path="/expenses/:id">
                    <ExpenseEdit />
                </PrivateRoute>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/base">
                    <BasePage />
                </Route>
            </Switch>
        </ThemeProvider>
    );
}

export default App;
