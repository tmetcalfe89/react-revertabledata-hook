import { useCallback, useMemo, useState } from "react";

export default function useRevertableData(defaultValues) {
  const [newValues, setNewValues] = useState({});

  const revert = useCallback(() => setNewValues({}), []);
  const revertValue = useCallback(
    (key) =>
      setNewValues((prev) =>
        JSON.parse(JSON.stringify({ ...prev, [key]: undefined }))
      ),
    []
  );
  const updateValue = useCallback(
    (key, value) => {
      setNewValues((prev) => {
        const realValue =
          typeof value === "function" ? value(prev[key]) : value;
        return defaultValues[key] === realValue
          ? JSON.parse(JSON.stringify({ ...prev, [key]: undefined }))
          : { ...prev, [key]: realValue };
      });
    },
    [defaultValues]
  );
  const isChanged = useCallback(
    (key) => newValues[key] !== undefined,
    [newValues]
  );

  const currentValues = useMemo(() => {
    const retval = JSON.parse(JSON.stringify(defaultValues));
    for (let key in newValues) {
      retval[key] = newValues[key];
    }
    return retval;
  }, [defaultValues, newValues]);
  const anyUpdates = useMemo(
    () => Object.keys(newValues).length !== 0,
    [newValues]
  );

  const getValue = useCallback((key) => currentValues[key], [currentValues]);

  return {
    defaultValues,
    currentValues,
    newValues,
    revert,
    revertValue,
    updateValue,
    getValue,
    isChanged,
    anyUpdates,
  };
}
