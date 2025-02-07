import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import { withTranslation } from "react-i18next";

const VerticalLayout = (props) => {
  const menuData = [
    {
      MenuGroup: "Dashboard",
      items: [
        { _id: 1, MenuName: "Dashboard", Link: "/Dashboard" },
      ],
    },
  ];

  const renderMenuItems = () => {
    return (
      <React.Fragment>
        {menuData.map((group, index) => (
          <React.Fragment key={index}>
            {group.items.map((menuItem) => (
              <li key={menuItem._id} className="nav-item">
                <Link className="nav-link menu-link" to={menuItem.Link}>
                  <span>{menuItem.MenuName}</span>
                </Link>
              </li>
            ))}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return <React.Fragment>{renderMenuItems()}</React.Fragment>;
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));