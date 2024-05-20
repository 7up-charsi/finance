import {
  Button,
  NumberInput,
  NumberInputProps,
} from '@typeweave/react';
import { mergeRefs } from '@typeweave/react-utils';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import React from 'react';

export interface AmountInputProps extends NumberInputProps {
  value: string;
}

const displayName = 'AmountInput';

export const AmountInput = React.forwardRef<
  HTMLInputElement,
  AmountInputProps
>((props, forwardedRef) => {
  const { value, onChange, ...restProps } = props;

  const [isIncome, setIsIncome] = React.useState(true);

  const innerRef = React.useRef<HTMLInputElement>(null);

  const parsedValue = parseFloat(value);

  return (
    <NumberInput
      ref={mergeRefs(forwardedRef, innerRef)}
      {...restProps}
      value={value}
      onChange={(e) => {
        onChange?.(e);

        const parsedValue = parseFloat(e.target.value);

        if (parsedValue > 0) setIsIncome(true);
        if (parsedValue < 0) setIsIncome(false);
      }}
      helperText={
        parsedValue
          ? `this will count as ${isIncome ? 'income' : 'expense'}`
          : '[+] indicates income and [-] indicates expense'
      }
      startContent={
        <Button
          color={isIncome ? 'success' : 'danger'}
          aria-label={`change to ${isIncome ? 'expense' : 'income'}`}
          type="button"
          isIconOnly
          size="sm"
          onPress={() => {
            setIsIncome((prev) => !prev);

            if (innerRef.current?.value)
              onChange?.({
                target: {
                  value: `${+innerRef.current.value * -1}`,
                },
              } as never);
          }}
        >
          {isIncome ? <PlusCircleIcon /> : <MinusCircleIcon />}
        </Button>
      }
    />
  );
});

AmountInput.displayName = displayName;
