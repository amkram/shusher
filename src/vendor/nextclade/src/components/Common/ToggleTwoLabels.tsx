import React, { ReactNode, useCallback } from 'react'

import styled from 'styled-components'
import ReactToggle, { ToggleProps as ReactToggleProps } from 'react-toggle'
import 'react-toggle/style.css'
import { StrictOmit } from 'ts-essentials'

export const Label = styled.label`
  flex: 0;
  display: flex;
  margin: 0 auto;
  word-wrap: normal;
  text-overflow: clip;
  white-space: nowrap;
`

export const ToggleTwoLabelsBase = styled(ReactToggle)<ReactToggleProps>`
  &.react-toggle-two-labels-custom {
    & > .react-toggle-track {
      background-color: #4a5bc6;
    }

    .react-toggle-thumb {
      border-color: #4a5bc6;
    }

    &.react-toggle--checked > .react-toggle-track {
      background-color: #d8782e;
    }

    &.react-toggle--checked .react-toggle-thumb {
      border-color: #d8782e;
    }

    &:hover {
      & > .react-toggle-track {
        background-color: #8494ec;
      }

      &.react-toggle--checked > .react-toggle-track {
        background-color: #e89e6c;
      }
    }
  }
`

export interface ToggleTwoLabelsProps extends StrictOmit<ReactToggleProps, 'type' | 'value'> {
  identifier: string
  onCheckedChanged: (checked: boolean) => void
  labelLeft?: ReactNode
  labelRight?: ReactNode
  className?: string
}

export function ToggleTwoLabels({
  identifier,
  onCheckedChanged,
  labelLeft,
  labelRight,
  className,
  ...props
}: ToggleTwoLabelsProps) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChanged(e.target.checked)
    },
    [onCheckedChanged],
  )

  return (
    <Label htmlFor={identifier} className={className}>
      {labelRight}
      <span className="mr-2 ml-2">
        <ToggleTwoLabelsBase
          id={identifier}
          className="react-toggle-two-labels-custom"
          icons={false}
          onChange={onChange}
          {...props}
        />
      </span>
      {labelLeft}
    </Label>
  )
}
