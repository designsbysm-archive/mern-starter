import { Link, NavLink } from "react-router-dom";
import { removeToken } from "../tools/appToken";
import React from "react";

//assets
import "../styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/pro-regular-svg-icons";
import { faUser, faAngleDown } from "@fortawesome/pro-solid-svg-icons";
import logo from "../images/logo.svg";

const getGreeting = user => {
  if (!user) {
    return "Unknown";
  }

  const { name, username } = user;

  if (name) {
    return ` ${name.first} ${name.last}`;
  } else if (username) {
    return ` ${username}`;
  }
};

// class Dropdown extends React.Component {
//   state = {
//     dropdownVisible: false,
//   };

//   getSubItems = (methods, group, hideMenu) => {
//     return methods
//       .filter(method => method.group === group)
//       .map(method => (
//         <li className="nav-subitem" key={method.key} onClick={hideMenu}>
//           <Link to={method.key}>{method.name}</Link>
//         </li>
//       ));
//   };

//   handleMenuHide = () => {
//     this.setState(() => {
//       return {
//         dropdownVisible: false,
//       };
//     });
//   };

//   handleMenuShow = () => {
//     this.setState(() => {
//       return {
//         dropdownVisible: true,
//       };
//     });
//   };

//   handleMenuToggle = () => {
//     this.setState(state => {
//       return {
//         dropdownVisible: !state.dropdownVisible,
//       };
//     });
//   };

//   render() {
//     return (
//       <div
//         className="nav-item"
//         onClick={this.handleMenuToggle}
//         onMouseEnter={this.handleMenuShow}
//         onMouseLeave={this.handleMenuHide}
//       >
//         <div className="title">
//           {this.props.title}
//           <FontAwesomeIcon icon={faAngleDown} />
//         </div>
//         <ul className={`dropdown ${this.state.dropdownVisible ? "show" : "hide"}`}>
//           {[
//             "2x2",
//             "3x3",
//             "Other",
//           ].map(group => [
//             <li className="nav-subitem group" key={group}>
//               {group}
//             </li>,
//             this.getSubItems(this.props.methods, group, this.handleMenuHide),
//           ])}
//         </ul>
//       </div>
//     );
//   }
// }

const generateMenu = menu =>
  menu.map(route => {
    if (route.hidden) {
      return null;
    }

    return NavItem(route);
  });

const Logo = ({ image }) => (
  <Link to="/" className="logo">
    <img src={image} alt="SM Logo" />
  </Link>
);

const LogoutItem = logoutCB => {
  return (
    <div key={"admin/logout"}>
      <span
        className="link"
        onClick={() => {
          removeToken();
          logoutCB();
        }}
      >
        <FontAwesomeIcon className="icon" icon={faSignOut} />
        Logout
      </span>
    </div>
  );
};

const UserItem = user => {
  return (
    <div key={"admin/user"}>
      <span className="link">
        <FontAwesomeIcon className="icon" icon={faUser} />
        {getGreeting(user)}
        <FontAwesomeIcon className="caret" icon={faAngleDown} />
      </span>
    </div>
  );
};

const NavItem = route => {
  return (
    <div key={route.title + route.url}>
      <NavLink exact activeClassName="current" key={route.url} to={route.url}>
        {route.icon ? <FontAwesomeIcon className="icon" icon={route.icon} /> : null}
        {route.title}
      </NavLink>
    </div>
  );
};

const Nav = ({ logoutCB, routes, user }) => (
  <nav>
    <div key="main" className="menu main">
      {generateMenu(routes.main)}
    </div>
    <div key="admin" className="menu admin">
      {UserItem(user)}
      {generateMenu(routes.admin)}
      {LogoutItem(logoutCB)}
    </div>
  </nav>
);

const Header = ({ config, logoutCB, routes }) => {
  const { user } = config;

  return (
    <header>
      <Logo image={logo} />
      {user ? <Nav logoutCB={logoutCB} routes={routes} user={user} /> : null}
    </header>
  );
};

export default Header;
