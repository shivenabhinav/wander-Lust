"use client";

import Categories from "./components/Categories";
import TopDestinations from "./components/TopDestinations";
import AllProperties from "./components/AllProperties";

export default function ExplorePage() {
  return (
    <div className="px-4 md:px-10 pt-15 space-y-16 ">
      <Categories />
      {/* <TopDestinations /> */}
      <AllProperties />
    </div>
  );
}
