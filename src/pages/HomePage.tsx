import React from 'react'
import styled from 'styled-components'
import CharacterGrid from '../components/CharacterGrid'

const HomePageContainer = styled.div`
  background-image: url('/img/bg.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const HomeContent = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px 0 2rem; // Add padding to account for the fixed header
`

export default function HomePage() {
  return (
    <HomePageContainer>
      <HomeContent>
        <CharacterGrid />
      </HomeContent>
    </HomePageContainer>
  )
}