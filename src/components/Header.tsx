import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const HeaderContainer = styled.header<{ $isHomePage: boolean; $scrollPosition: number }>`
  padding: 1rem 2rem;
  background-color: ${props => props.$isHomePage 
    ? `rgba(26, 26, 26, ${Math.min(props.$scrollPosition / 300, 0.8)})`
    : '#1a1a1a'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, padding 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
  
  @media (max-width: 768px) {
    height: 30px;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const DropdownContainer = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  background-color: #1a1a1a;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
`

const DropdownItem = styled(Link)`
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`

interface HeaderProps {
  isHomePage?: boolean
}

export default function Header({ isHomePage = false }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <HeaderContainer $isHomePage={isHomePage} $scrollPosition={scrollPosition}>
      <Logo to="/">
        <LogoImage src="/img/logo.png" alt="Novel Website Logo" />
      </Logo>
      <Nav>
        <NavLink to="/">首页</NavLink>
        <NavLink to="/about">关于</NavLink>
        {!isHomePage && (
          <DropdownContainer>
            <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              阅读
            </DropdownButton>
            <DropdownContent isOpen={isDropdownOpen}>
              <DropdownItem to="/novel/1">求生篇</DropdownItem>
              <DropdownItem to="/novel/2">救世篇</DropdownItem>
              <DropdownItem to="/novel/3">机密档案</DropdownItem>
              <DropdownItem to="/novel/4">死囚</DropdownItem>
              <DropdownItem to="/novel/5">X篇</DropdownItem>
              <DropdownItem to="/novel/6">血腥南十字</DropdownItem>
            </DropdownContent>
          </DropdownContainer>
        )}
      </Nav>
    </HeaderContainer>
  )
}