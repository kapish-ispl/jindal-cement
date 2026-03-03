"use client";

import { serverRequest } from "@/services/getServerSideRender";
import { GET_MENU_ENDPOINT } from "@/config/apiConfig";
import { ReactNode, createContext, useState, useEffect } from "react";
import { CONSTANTS } from "@/config/constant";
import AOS from "aos";

type contextType = {
    headerMenu: never[];
    footerMenu: never[];
    menuType: string;
};

export const AppContext = createContext<contextType>({
    headerMenu: [],
    footerMenu: [],
    menuType: "",
});

const AppContextProvider = ({ children }: { children: ReactNode }) => {

    const [headerMenu, setHeaderMenu] = useState([]);
    const [footerMenu, setFooterMenu] = useState([]);
    const [menuType, setMenuType] = useState("page");


    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        //Fetch data from API
        const perRequiredRequest = async () => {
            const getHeaderMenu = await serverRequest(
                {},
                `${GET_MENU_ENDPOINT}?slug=${CONSTANTS.HEADER_MENU_SLUG}`,
                CONSTANTS.REQUEST_GET, 'client'
            );
            if (getHeaderMenu && getHeaderMenu.code == CONSTANTS.STATUS_SUCCESS) {
                setHeaderMenu(getHeaderMenu.data);
            } else {
                setHeaderMenu([]);
            }

            const getFooterMenu = await serverRequest({}, `${GET_MENU_ENDPOINT}?slug=${CONSTANTS.FOOTER_MENU_SLUG}`, CONSTANTS.REQUEST_GET, 'client');
            if (getFooterMenu && getFooterMenu.code == CONSTANTS.STATUS_SUCCESS) {
                setFooterMenu(getFooterMenu.data);
            } else {
                setFooterMenu([]);
            }
            // const getProducts = await serverRequest({}, `${GET_POST_ENDPOINT}?slug=product`, CONSTANTS.REQUEST_GET);
            // setProductData(getProducts);
        };
        perRequiredRequest();
    }, []);


    const values = { headerMenu, footerMenu, menuType, setMenuType, };
    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;


