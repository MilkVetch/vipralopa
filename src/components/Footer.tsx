import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  background-color: rgba(26, 26, 26, 0.8);
  color: #fff;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
`

export default function Footer() {
  return (
    <FooterContainer>
      <p>&copy; 2023 Novel Website. All rights reserved.</p>
    </FooterContainer>
  )
}