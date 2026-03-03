import Link from "next/link";
import { menuItemsProps } from "./Header";




const splitMenuItems = (
  items: menuItemsProps[],
  maxPerColumn = 9
): menuItemsProps[][] => {
  const columns: menuItemsProps[][] = [];

  for (let i = 0; i < items.length; i += maxPerColumn) {
    columns.push(items.slice(i, i + maxPerColumn));
  }

  return columns;
};





type RecursiveMenuProps = {
    items: menuItemsProps[];
    setIsMegaActive:any;
    isThirdMenu: boolean;
    setThirdLevelMenu?: (items: menuItemsProps[] | null) => void;
};

function RecursiveMenu({
    items,
    isThirdMenu,
    setIsMegaActive,
    setThirdLevelMenu,
}: RecursiveMenuProps) {
    const columns = splitMenuItems(items, 9);

    return (
        <div className="recursive-menu">
            {columns.map((columnItems, colIndex) => (
                <ul key={colIndex} role="menu" className="recursive-menu__list mb-4">
                    {columnItems.map((item) => (
                        <li key={item.id} role="none">
                            <span className="left_icon">
                                <svg
                                    width="7"
                                    height="9"
                                    viewBox="0 0 7 9"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.5 0.500031L5.34236 4.10009C5.6395 4.32099 5.6395 4.67907 5.34236 4.89998L0.500001 8.50003"
                                        stroke="#4FB848"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>

                            <Link
                                href={item.link}
                                role="menuitem"
                                prefetch={false}
                                onClick={() => setIsMegaActive(false)}
                                onMouseEnter={() =>
                                    setThirdLevelMenu?.(
                                        item.children && item.children.length > 0
                                            ? item.children
                                            : null
                                    )
                                }
                                target={item.is_new_tab === 1 ? "_blank" : "_self"}
                            >
                                {item.name}

                                {!isThirdMenu &&
                                    item.children &&
                                    item.children.length > 0 && (
                                        <span className="right_icon">
                                            <svg
                                                width="13"
                                                height="24"
                                                viewBox="0 0 13 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M0.5 0.5L11.2579 10.6279C11.918 11.2493 11.918 12.2567 11.2579 12.8782L0.500002 23.006"
                                                    stroke="#A1A1A1"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </span>
                                    )}
                            </Link>
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    );
}

export default RecursiveMenu;
