import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NovelPage from './pages/NovelPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

const FooterContainer = styled.div<{ $isFixed: boolean }>`
  ${props => props.$isFixed ? `
    position: fixed;
    bottom: 0;
    width: 100%;
  ` : `
    margin-top: auto;
  `}
`;

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header isHomePage={isHomePage} />
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/novel/:id" element={<NovelPage />} />
        </Routes>
      </MainContent>
      <FooterContainer $isFixed={isHomePage}>
        <Footer />
      </FooterContainer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <AppContent />
      </AppContainer>
    </Router>
  );
};

export default App;