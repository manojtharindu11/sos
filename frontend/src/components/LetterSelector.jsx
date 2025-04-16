import React from "react";
import { Select } from "@chakra-ui/react";

const LetterSelector = ({ letter, setLetter }) => (
  <Select value={letter} onChange={(e) => setLetter(e.target.value)} width="100px" mb={4}>
    <option value="S">S</option>
    <option value="O">O</option>
  </Select>
);

export default LetterSelector;
