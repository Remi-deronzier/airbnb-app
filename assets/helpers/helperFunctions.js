import React from "react";
import { Ionicons } from "@expo/vector-icons";

const displayStars = (ratingValue) => {
  const numberOfFullStars =
    ratingValue - Math.floor(ratingValue) >= 0.25 &&
    ratingValue - Math.floor(ratingValue) <= 0.75
      ? Math.floor(ratingValue)
      : Math.round(ratingValue);
  const numberOfHalfStars =
    ratingValue - Math.floor(ratingValue) >= 0.25 &&
    ratingValue - Math.floor(ratingValue) <= 0.75
      ? 1
      : 0;
  const tab = [];
  for (let i = 0; i < numberOfFullStars; i++) {
    tab.push(<Ionicons name="star-sharp" size={24} color="#eba834" key={i} />);
  }
  for (let i = 0; i < numberOfHalfStars; i++) {
    tab.push(
      <Ionicons name="star-half-sharp" size={24} color="#eba834" key={i + 10} />
    );
  }
  return tab;
};

export { displayStars };
