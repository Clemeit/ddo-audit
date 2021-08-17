// import * as React from "react";
// import { Collapse, Navbar, NavbarToggler, NavItem, NavLink } from "reactstrap";
// import { Link, useLocation } from "react-router-dom";
// import "./NavMenu.css";

// import { ReactComponent as HomeSVG } from "../assets/global/home.svg";
// import { ReactComponent as ServersSVG } from "../assets/global/servers.svg";
// import { ReactComponent as GroupingSVG } from "../assets/global/grouping.svg";
// import { ReactComponent as WhoSVG } from "../assets/global/who.svg";
// import { ReactComponent as GeographySVG } from "../assets/global/geography.svg";
// import { ReactComponent as TrendsSVG } from "../assets/global/trends.svg";
// import { ReactComponent as AboutSVG } from "../assets/global/about.svg";

// export default class NavMenu extends React.PureComponent<
//     {},
//     { isOpen: boolean }
// > {
//     public state = {
//         isOpen: false,
//     };
//     public render() {
//         return (
//             <header>
//                 <Navbar
//                     className="navbar navbar-expand-md navbar-toggleable-md navbar-light"
//                     style={{ padding: 0 }}
//                 >
//                     <NavbarToggler onClick={this.toggle} className="mr-2" />
//                     <Collapse
//                         className="d-md-inline-flex flex-md-row"
//                         isOpen={this.state.isOpen}
//                         navbar
//                     >
//                         <ul className="navbar-nav flex-grow">
//                             <NavItem className="nav-item active">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/"
//                                 >
//                                     <HomeSVG className="nav-icon" />
//                                     Home
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/servers"
//                                 >
//                                     <ServersSVG className="nav-icon" />
//                                     Server
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/grouping"
//                                 >
//                                     <GroupingSVG className="nav-icon" />
//                                     Grouping
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/who"
//                                 >
//                                     <WhoSVG className="nav-icon" />
//                                     Who
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/geography"
//                                 >
//                                     <GeographySVG className="nav-icon" />
//                                     Geography
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/trends"
//                                 >
//                                     <TrendsSVG className="nav-icon" />
//                                     Trends
//                                 </NavLink>
//                             </NavItem>
//                             <NavItem className="nav-item">
//                                 <NavLink
//                                     tag={Link}
//                                     className="nav-inner"
//                                     to="/about"
//                                 >
//                                     <AboutSVG className="nav-icon" />
//                                     About
//                                 </NavLink>
//                             </NavItem>
//                         </ul>
//                     </Collapse>
//                 </Navbar>
//             </header>
//         );
//     }

//     private toggle = () => {
//         this.setState({
//             isOpen: !this.state.isOpen,
//         });
//     };
// }
