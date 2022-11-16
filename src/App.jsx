import React from "react";
import NestedCheckbox from "./NestedCheckbox";

export default function App() {
  const [value, onChange] = React.useState({
    foo: true,
    bar: false,
    group1: {
      level2: true,
      level2option2: false,
      nested: {
        option: true
      },
      double: {
        nested: {
          fam: {
            soul: true,
            ja: false,
            boy: true,
            tell: false,
            em: true
          }
        }
      }
    }
  });
  console.log('RENDER', 'App')
  return (
    <div className="App">
      <NestedCheckbox value={value} onChange={onChange} />
    </div>
  );
}
