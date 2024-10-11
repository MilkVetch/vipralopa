import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const NovelContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
  padding: 2rem;
  height: calc(100vh - 120px); // Adjust based on your header and footer height
`;

const TableOfContents = styled.div<{ isOpen: boolean; maxWidth: number }>`
  width: ${props => props.isOpen ? `${props.maxWidth}px` : '0'};
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  height: calc(100vh - 180px); // Adjust to leave some space at the bottom
  position: sticky;
  top: 120px; // Adjust based on your header height
`;

const ChapterList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChapterItem = styled.li<{ isActive: boolean }>`
  margin-bottom: 0.5rem;
  background-color: ${props => props.isActive ? '#333' : 'transparent'};
`;

const ChapterLink = styled.button`
  background: none;
  border: none;
  color: #ff4500;
  cursor: pointer;
  text-align: left;
  padding: 0.5rem;
  font-size: 1rem;
  transition: color 0.3s ease;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #ff6347;
  }
`;

const Content = styled.div`
  flex: 1;
  color: #fff;
  line-height: 1.6;
  padding-left: 2rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChapterNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
`;

const NavButton = styled.button`
  background-color: #ff4500;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff6347;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff4500;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 1000;

  &:hover {
    background-color: #ff6347;
  }
`;

const ChapterTitle = styled.h2`
  font-size: 2rem;
  color: #ff4500;
  margin-bottom: 1rem;
`;

const NovelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [novelTitle, setNovelTitle] = useState('');
  const [maxTitleWidth, setMaxTitleWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/markdown/novel${id}.md`)
      .then((response) => response.text())
      .then((text) => {
        const chapterTitles = text.match(/^#### .+$/gm) || [];
        setChapters(chapterTitles.map((title) => title.replace('#### ', '')));
        setNovelTitle(text.match(/^# .+$/m)?.[0].replace('# ', '') || '');
        const firstChapterContent = text.split(/^#### /m)[1];
        setContent(`#### ${firstChapterContent}`);

        // Calculate max title width
        const tempDiv = document.createElement('div');
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempDiv);

        let maxWidth = 0;
        chapterTitles.forEach(title => {
          tempDiv.textContent = title;
          maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
        });

        document.body.removeChild(tempDiv);
        setMaxTitleWidth(maxWidth + 40); // Add some padding
      });
  }, [id]);

  useEffect(() => {
    document.title = `《${novelTitle}》- Chapter ${currentChapter + 1}`;
  }, [novelTitle, currentChapter]);

  const handleChapterClick = (index: number) => {
    setCurrentChapter(index);
    fetch(`/markdown/novel${id}.md`)
      .then((response) => response.text())
      .then((text) => {
        const chapterContent = text.split(/^#### /m)[index + 1];
        setContent(`#### ${chapterContent}`);
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      });
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      handleChapterClick(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      handleChapterClick(currentChapter + 1);
    }
  };

  const toggleTableOfContents = () => {
    setIsTableOpen(!isTableOpen);
  };

  return (
    <NovelContainer>
      <TableOfContents isOpen={isTableOpen} maxWidth={maxTitleWidth}>
        <ChapterList>
          {chapters.map((chapter, index) => (
            <ChapterItem key={index} isActive={index === currentChapter}>
              <ChapterLink onClick={() => handleChapterClick(index)}>{chapter}</ChapterLink>
            </ChapterItem>
          ))}
        </ChapterList>
      </TableOfContents>
      <Content ref={contentRef}>
        {currentChapter > 0 && currentChapter < chapters.length - 1 && (
          <ChapterNavigation>
            <NavButton onClick={handlePrevChapter} disabled={currentChapter === 0}>
              Previous Chapter
            </NavButton>
            <NavButton onClick={handleNextChapter} disabled={currentChapter === chapters.length - 1}>
              Next Chapter
            </NavButton>
          </ChapterNavigation>
        )}
        <ReactMarkdown
          components={{
            h4: ({ node, ...props }) => <ChapterTitle {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
        {currentChapter > 0 && currentChapter < chapters.length - 1 && (
          <ChapterNavigation>
            <NavButton onClick={handlePrevChapter} disabled={currentChapter === 0}>
              Previous Chapter
            </NavButton>
            <NavButton onClick={handleNextChapter} disabled={currentChapter === chapters.length - 1}>
              Next Chapter
            </NavButton>
          </ChapterNavigation>
        )}
      </Content>
      <ToggleButton onClick={toggleTableOfContents}>
        {isTableOpen ? 'Hide' : 'Show'} TOC
      </ToggleButton>
    </NovelContainer>
  );
};

export default NovelPage;