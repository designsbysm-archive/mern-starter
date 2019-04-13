import React from "react";
import { Link, NavLink } from "react-router-dom";
import { removeToken } from "../tools/http/appToken";

//components

//assets
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import logo from "../images/logo.svg";

const getGreeting = user => {
  let greeting = "Welcome";

  if (user) {
    const { name, username } = user;

    if (name) {
      greeting += ` ${name.first} ${name.last}`;
    } else if (username) {
      greeting += ` ${username}`;
    }
  }

  greeting += "!";

  return greeting;
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

const Logo = ({ image }) => (
  <Link to="/">
    <img className="logo" src={image} alt="SM Logo" />
  </Link>
);

const Nav = ({ logoutCB, routes }) => (
  <nav>
    <ul key="main" className="main">
      {routes.main.map(route => {
        if (route.hidden) {
          return null;
        }

        return (
          <li key={"main" + route.url}>
            <NavLink exact activeClassName="current" key={route.url} to={route.url}>
              {route.title}
            </NavLink>
          </li>
        );
      })}
    </ul>
    <ul key="admin" className="admin">
      {routes.admin.map(route => {
        if (route.hidden) {
          return null;
        }

        return (
          <li key={"admin" + route.url}>
            <NavLink exact activeClassName="current" key={route.url} to={route.url}>
              {route.title}
            </NavLink>
          </li>
        );
      })}

      <li key={"admin/logout"}>
        <span
          onClick={() => {
            removeToken();
            logoutCB();
          }}
        >
          Logout
        </span>
      </li>
    </ul>
  </nav>
);

const Header = ({ config, logoutCB, routes }) => {
  const { user } = config;

  return (
    <header>
      <p>{user ? getGreeting(user) : "Please login"}</p>
      <Logo image={logo} />
      {user ? <Nav logoutCB={logoutCB} routes={routes} /> : null}
    </header>
  );
};

export default Header;
