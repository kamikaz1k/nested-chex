import React from "react";

type FormObj = {
  [key: string]: boolean | FormObj;
};

type DebugProps = {
  _nesting: number;
  _key: string;
}

type Props = {
  value: FormObj;
  onChange: (newValue: FormObj) => void;
} & DebugProps;

const isDebug = false;

const isObject = (obj: unknown) => {
  return typeof obj === "object";
};

const recursiveSet = (obj: FormObj, newValue) => {
  Object.keys(obj).forEach(key => {
    const val = obj[key];

    if (isObject(val)) {
      recursiveSet(val as FormObj, newValue);
    } else {
      obj[key] = newValue
    }
  })
}

const isNestedTrue = (obj: FormObj) => {
  const vals = Object.values(obj)
  for (let val of vals) {
    if (isObject(val)) {
      if (!isNestedTrue(val as FormObj)) {
        return false
      }
    } else {
      if (!val) return false;
    }
  }
  return true
};

function NestedCheckbox({ value, onChange, _nesting = 0, _key = 'root' }: Props) {
  const options: Array<[string, boolean | FormObj]> = [];
  Object.keys(value).forEach((k) => {
    options.push([k, value[k]]);
  });

  const onCheckboxChange = React.useCallback( (newValue, key) => {
    if (isObject(value[key])) {
      // This part is actually an [EXTRA] requirement, so you can ignore this tbh
      const clone = JSON.parse(JSON.stringify(value[key]))
      recursiveSet(clone, newValue);
      onChange({ ...value, [key]: clone });
    } else {
      onChange({ ...value , [key]: newValue });
    }
  }, [value]);

  const wrappedOnChange = React.useCallback((newValue, key) => {
    onChange({ ...value, [key]: newValue })
  }, [value])

  console.log('RENDER', _nesting, _key)

  return (
    <div style={{ paddingLeft: 15 }}>
      {options.map(([key, currValue], idx) => {
        const isNested = typeof currValue !== "boolean";
        const checkVal = typeof currValue === "boolean" ? currValue : isNestedTrue(currValue);
        return (
          <div key={key + idx}>
            <label>
              <input
                type="checkbox"
                checked={checkVal}
                onChange={(newValue) => onCheckboxChange(newValue.target.checked, key)}
              />
              <span>{key}</span>
              {isNested && (
                <MemoizedNestedCheckbox value={currValue} onChange={n => wrappedOnChange(n, key)} _nesting={_nesting + 1} _key={key} />
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}

function areEqual(prevProps: Props, newProps: Props) {
  return prevProps.value === newProps.value
}

const MemoizedNestedCheckbox =  React.memo(NestedCheckbox, areEqual);

export default MemoizedNestedCheckbox;
