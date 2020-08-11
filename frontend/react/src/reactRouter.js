import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/sections/homepage/Homepage";
import BasicInfo from "./components/sections/basicInfo/BasicInfo";
import Section1 from "./components/sections/section1/Section1";
import Section1Api from "./components/sections/section1api/Section1";
import Section2AApi from "./components/sections/section2api/Section2A";
import Section2BApi from "./components/sections/section2api/Section2BApi";
import Section2a from "./components/sections/section2a/Section2A";
import Section2b from "./components/sections/section2b/Section2B";
import Section3a from "./components/sections/section3a/Section3A";
import Section3c from "./components/sections/section3c/Section3C";
import Review from "./components/review/Review";
import Sidebar from "./components/layout/Sidebar";
import test from "./components/test";

let VisibleSidebar =
  window.location.pathname === "/" ||
    window.location.pathname.split("/")[1] === "reports" ? null : (
      <Sidebar />
    );

const Routes = () => (
  <Router>
    <div className="ds-l-container">
      <div className="ds-l-row">
        {VisibleSidebar}
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/basic-info" component={BasicInfo} />
          <Route exact path="/section1" component={Section1} />
          <Route exact path="/section1-api" component={Section1Api} />
          <Route exact path="/section2/2a" component={Section2a} />
          <Route exact path="/section2/2b" component={Section2b} />
          <Route exact path="/section2A-api" component={Section2AApi} />
          <Route exact path="/section2B-api" component={Section2BApi} />
          <Route exact path="/section3/3a" component={Section3a} />
          <Route exact path="/section3/3c" component={Section3c} />
          <Route path="/reports/:stateAbbrev/:year" component={Review} />
          <Route exact path="/test" component={test} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default Routes;
