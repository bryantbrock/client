import { useCallback, useEffect, useRef, ChangeEvent } from "react";
import { CheckboxProps, Checkbox } from "@chakra-ui/react";

export const IndeterminateCheckbox = ({
  indeterminate,
  onChange,
  ...rest
}: CheckboxProps & { indeterminate?: boolean }) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  const internalOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    },
    [onChange]
  );

  return (
    <Checkbox
      onChange={internalOnChange}
      isChecked={rest.checked}
      ref={ref}
      {...rest}
    />
  );
};
