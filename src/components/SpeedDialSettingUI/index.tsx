import Settings from '@mui/icons-material/Settings';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Close from '@mui/icons-material/Close';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import config from '../../config';
import { selectIsTheme, setIsTheme } from './themeSlice';
import { FlatEngLand, FlatVietNam } from '../../assets/icon';
import Button from '../Button';

const SpeedDialSettingUI = () => {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const { t } = useTranslation('speedDialSettingUI');
    const theme = useSelector(selectIsTheme);

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>(config.Language.vietNam);
    const [mode, setMode] = useState<string>(theme);

    const toggleDrawer = () => {
        setOpenDrawer((prev) => !prev);
    };

    const handleGetLanguage = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
        i18n.changeLanguage(event.target.value as string);
    };

    const handleChangeMode = (value: string) => {
        setMode(value);
    };

    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
            dispatch(setIsTheme('dark'));
        } else {
            document.documentElement.classList.remove('dark');
            dispatch(setIsTheme('light'));
        }
    }, [mode]);

    return (
        <>
            <div className="fixed bottom-5 right-5 animate-spin-slow z-40">
                <Fab
                    color="primary"
                    onClick={toggleDrawer}
                    className="hover:!bg-primary-700 !bg-primary-500 animate-spin-slow"
                >
                    <Settings />
                </Fab>
            </div>
            <Drawer anchor={'right'} open={openDrawer} onClose={toggleDrawer}>
                <div className="!space-y-3">
                    <div className="flex justify-between items-center px-4 pt-3">
                        <div className="text-lg font-bold tracking-wide">{t('settings')}</div>
                        <Button
                            onClick={toggleDrawer}
                            className="!size-fit !rounded-full hover:bg-gray-100 dark:hover:bg-gray-100/20 transition !p-1"
                        >
                            <Close />
                        </Button>
                    </div>
                    <div className="h-[0.1rem] bg-gray-300 w-full dark:bg-gray-500"></div>

                    <div className="space-y-7 pt-3 px-4">
                        <div className="flex flex-col gap-2 w-screen sm:w-80">
                            <div className="text-xs font-normal text-gray-600 dark:text-gray-300 uppercase">
                                {t('language')}
                            </div>

                            {/* <FormControl fullWidth>
                            <InputLabel>{t('language')}</InputLabel> */}
                            <Select
                                // input={<OutlinedInput label={t('language')} />}
                                value={language}
                                onChange={handleGetLanguage}
                                variant="standard"
                            >
                                <MenuItem value={config.Language.vietNam}>
                                    <div className="flex items-center gap-5">
                                        <FlatVietNam />
                                        {t('vietNam')}
                                    </div>
                                </MenuItem>
                                <MenuItem value={config.Language.english}>
                                    <div className="flex items-center gap-5">
                                        <FlatEngLand />
                                        {t('english')}
                                    </div>
                                </MenuItem>
                            </Select>
                            {/* </FormControl> */}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-normal text-gray-600 dark:text-gray-300 uppercase">
                                {t('mode')}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={mode === 'dark' ? 'fill' : 'outline'}
                                    fullWidth
                                    startIcon={<DarkMode />}
                                    onClick={() => handleChangeMode('dark')}
                                >
                                    {t('dark')}
                                </Button>
                                <Button
                                    variant={mode === 'light' ? 'fill' : 'outline'}
                                    fullWidth
                                    startIcon={<LightMode />}
                                    onClick={() => handleChangeMode('light')}
                                >
                                    {t('light')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default SpeedDialSettingUI;
