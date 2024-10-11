import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 60px auto;
  padding: 2rem;
  color: #fff;
`;

const AboutImage = styled.img`
  max-width: 40%;
  height: auto;
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const AboutPage: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    document.title = "关于末世劫";
    fetch('/aboutMe.md')
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error fetching about content:', error));
  }, []);

  return (
    <AboutContainer>
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => <AboutImage {...props} alt="Author" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </AboutContainer>
  );
};

export default AboutPage;