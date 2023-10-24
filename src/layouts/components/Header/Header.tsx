import React, { useState, useEffect } from 'react';
import Image from '../../../components/Image';
import logo from '../../../assets/img/BG 2.png';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Person from '@mui/icons-material/Person';
import Favorite from '@mui/icons-material/Favorite';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import config from '../../../config';

const LIST_TOP = [
    {
        title: 'New Arrivals',
    },
    {
        title: 'Tops',
    },
    {
        title: 'Dresses',
    },
    {
        title: 'Jackets',
    },
    {
        title: 'Shoes',
    },
    {
        title: 'Sandals',
    },
    {
        title: 'Bags',
    },
];

function Header() {
    // const [isSignIn, setIsSignIn] = useState(true);
    // handle menu
    const [openMenu, setOpenMenu] = useState(false);
    const [openChildren, setOpenChildren] = useState(true);

    const toggleMenu = () => () => {
        setOpenMenu((prev) => !prev);
    };

    const toggleMenuChildren = () => {
        setOpenChildren(!openChildren);
    };
    // handle scroll to fix header
    const [scroll, setScroll] = useState(false);
    const listenScrollEvent = () => {
        window.scrollY > 100 ? setScroll(true) : setScroll(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);
        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);

    return (
        <>
            <div
                className={`${
                    scroll ? 'bg-header shadow-xl fixed duration-200 ease-in ' : 'bg-transparent absolute '
                } h-20 flex flex-col justify-center items-center  w-full z-50`}
            >
                <div className="w-11/12 grid grid-flow-col grid-cols-3 place-content-between ">
                    <form className="w-full h-full col-span-1 mt-1.5">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Search className="mr-1 my-0.5" />
                            <TextField
                                className=" w-4/6 text-sm border-b"
                                id="standard-basic"
                                label="Search for an Item..."
                                variant="standard"
                            />
                        </Box>
                    </form>
                    <div className="flex w-full justify-center">
                        <Link to={config.Routes.home}>
                            <Image src={logo} className="h-full w-48 col-span-1" />
                        </Link>
                    </div>
                    <div className="flex justify-end items-center md:gap-3 gap-0 col-span-1">
                        <Link to={config.Routes.logIn}>
                            <IconButton aria-label="person">
                                <Person />
                            </IconButton>
                        </Link>
                        <IconButton aria-label="favorite">
                            <Favorite />
                        </IconButton>
                        <Link to={config.Routes.cart}>
                            <IconButton aria-label="cart">
                                <Badge
                                    badgeContent={1}
                                    color="secondary"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular"
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Link>

                        <div>
                            <IconButton aria-label="favorite" onClick={toggleMenu()}>
                                <Menu />
                            </IconButton>
                            <Drawer anchor="right" open={openMenu} onClose={toggleMenu()}>
                                <List
                                    sx={{ minWidth: 300 }}
                                    className="w-full max-w-xs text-center"
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            <div className="text-2xl py-6">Menu</div>
                                        </ListSubheader>
                                    }
                                >
                                    {LIST_TOP.map((item, index) => (
                                        <ListItemButton key={index}>
                                            <ListItemText primary={item.title} />
                                        </ListItemButton>
                                    ))}

                                    <ListItemButton onClick={toggleMenuChildren}>
                                        <ListItemText primary="Contact" />
                                        {openChildren ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openChildren} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            <ListItemButton sx={{ pl: 4 }}>
                                                <ListItemText primary="Contact us" />
                                            </ListItemButton>
                                            <ListItemButton sx={{ pl: 4 }}>
                                                <ListItemText primary="About Duck" />
                                            </ListItemButton>
                                        </List>
                                    </Collapse>
                                </List>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Header;
