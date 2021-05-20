import React, { PropsWithChildren, HTMLProps } from 'react'

import styled from 'styled-components'

import { NavigationBar } from './NavigationBar'

export const LayoutContainer = styled.div`
  max-width: 1700px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

const Header = styled.header`
  flex-shrink: 0;
`

const MainContent = styled.main`
  flex-grow: 1;
  overflow: auto;
  min-height: 2em;
`

const Footer = styled.footer`
  flex-shrink: 0;
`

export function LayoutResults({ children }: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <LayoutContainer>
      <Header>
        <NavigationBar />
      </Header>

      <MainContent>{children}</MainContent>

    </LayoutContainer>
  )
}
