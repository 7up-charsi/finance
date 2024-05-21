import {
  Button,
  NumberInput,
  NumberInputProps,
} from '@typeweave/react';
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

  const isIncome = !value.startsWith('-');

  return (
    <NumberInput
      ref={forwardedRef}
      {...restProps}
      value={value}
      onChange={onChange}
      helperText={
        value
          ? `this will count as ${isIncome ? 'income' : 'expense'}`
          : '[+] indicates income and [-] indicates expense'
      }
      startContent={
        <Button
          excludeFromTabOrder
          color={isIncome ? 'success' : 'danger'}
          aria-label={`change to ${isIncome ? 'expense' : 'income'}`}
          type="button"
          isIconOnly
          size="sm"
          onPress={() => {
            onChange?.({
              target: {
                value: `${parseFloat(value) ? +value * -1 : -1}`,
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
