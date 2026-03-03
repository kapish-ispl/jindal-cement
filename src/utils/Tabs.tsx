import { useState, useEffect, FC, ReactElement } from "react";

export interface TabItemProps {
    attribs?: Record<string, string>;
    label?: string
    children?: ReactElement[];
}
export interface TabItem {
    props: TabItemProps;
}

export interface CustomReactElement extends ReactElement {
    props: TabItemProps;
}

const Tabs: FC<{ data: TabItem[] }> = ({ data }) => {
    const validTabs = data.filter((item) => item?.props?.label);

    const [openTab, setOpenTab] = useState(0);

    useEffect(() => {
        if (validTabs.length > 0) {
            setOpenTab(0);
        }
    }, []);
    return (
        <div className="tabbing_wrap v1">
            <ul>
                {validTabs.map((tabItem, index) => (
                    <li key={index} onClick={() => setOpenTab(index)}>
                        <button
                            className={`tabbing_wrap_item c-sector__item ${openTab === index ? "active" : ""
                                }`}
                        >
                            <span className="c-sector__item_label">
                                {tabItem.props?.label}
                            </span>
                            <span className="c-sector__item_border"></span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tabbing_wrap_content">
                {validTabs.map((tabItem, index) => (
                    <div
                        key={index}
                        className={`tabbing_wrap_content_item ${openTab === index ? "active" : "hidden"
                            }`}
                    >
                        <div className="row">{tabItem.props.children}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
