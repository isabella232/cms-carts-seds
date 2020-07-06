import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/sections/homepage/Homepage";
import BasicInfo from "./components/sections/BasicInfo";
import Section1 from "./components/sections/section1/Section1";
import Section2a from "./components/sections/section2a/Section2A";
import Section2b from "./components/sections/section2b/Section2B";
import Section3c from "./components/sections/section3c/Section3c";
import Sidebar from "./components/layout/Sidebar";

let VisibleSidebar = window.location.pathname === "/" ? null : <Sidebar />;

const Routes = () => (
  <Router>
    <div className="ds-l-container">
      <div className="ds-l-row">
        {VisibleSidebar}
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/basic-info" component={BasicInfo} />
          <Route exact path="/section1" component={Section1} />
          <Route exact path="/section2/2a" component={Section2a} />
          <Route exact path="/section2/2b" component={Section2b} />
          <Route exact path="/section3/3c" component={Section3c} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default Routes;
