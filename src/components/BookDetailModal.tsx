import React, { useEffect, useState, useCallback } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Novel } from '../utils/parseBooklist'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BookDetailModalProps {
  novels: Novel[];
  initialNovelId: number;
  onClose: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`

const slideOutLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`

const ModalOverlay = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${props => props.$isClosing ? fadeOut : fadeIn} 0.6s ease-out;
`

const ModalContent = styled.div`
  display: flex;
  width: 90%;
  max-width: 1200px;
  position: relative;
  height: 80vh;
  max-height: 700px;
  text-align: left;
  background-color: #1a1a1a;
  border-radius: 10px;
  // overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    width: 100%;
    max-height: none;
    border-radius: 0;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  z-index: 1001;
`

const NovelCoverContainer = styled.div<{ $isClosing: boolean }>`
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  animation: ${props => props.$isClosing ? css`${slideOutLeft} 0.5s ease-out forwards` : css`${slideInLeft} 0.5s ease-out`};

  @media (max-width: 768px) {
    width: 100%;
    height: 0;
    padding-top: 60%; // 5:3 aspect ratio
    position: relative;
  }
`

const NovelCover = styled.img`
  width: auto;
  height: 100%;
  object-fit: contain;
  aspect-ratio: 2 / 3;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const DetailContainer = styled.div<{ $isClosing: boolean }>`
  width: 60%;
  height: 100%;
  display: flex;
  animation: ${props => props.$isClosing ? css`${slideOutRight} 0.5s ease-out forwards` : css`${slideInRight} 0.5s ease-out`};

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    flex-direction: column;
  }
`

const TextContent = styled.div`
  width: 100%;
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const CharacterImageContainer = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2a2a2a;

  @media (max-width: 768px) {
    display: none;
  }
`

const CharacterImage = styled.img`
  max-height: 100%;
  object-fit: contain;
`

const NovelTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`

const CharacterName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Description = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
`

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #333;
  margin: 1.5rem 0;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`

const StartReadingButton = styled(Button)`
  background-color: #3a5a40;
  color: white;
  &:hover {
    background-color: #4a7a50;
  }
`

const ReturnButton = styled(Button)`
  background-color: #6b705c;
  color: white;
  &:hover {
    background-color: #7b806c;
  }
`

const CarouselButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 1rem;
  z-index: 1002;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const LeftCarouselButton = styled(CarouselButton)`
  left: -60px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`

const RightCarouselButton = styled(CarouselButton)`
  right: -60px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`

const MobileCarouselButtons = styled.div`
  display: none;
  justify-content: space-between;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileCarouselButton = styled(Button)`
  background-color: #3a5a40;
  color: white;
  margin: 0;
  flex: 1;

  &:first-child {
    margin-right: 0.5rem;
  }

  &:last-child {
    margin-left: 0.5rem;
  }

  &:hover {
    background-color: #4a7a50;
  }
`

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`

const FullScreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`

export default function BookDetailModal({ novels, initialNovelId, onClose }: BookDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [currentNovelIndex, setCurrentNovelIndex] = useState(novels.findIndex(novel => novel.id === initialNovelId))
  const [isFullScreenImage, setIsFullScreenImage] = useState(false)
  const navigate = useNavigate()

  const currentNovel = novels[currentNovelIndex]

  useEffect(() => {
    document.title = currentNovel.novelName
    return () => {
      document.title = 'Novel Website'
    }
  }, [currentNovel.novelName])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(onClose, 500)
  }, [onClose])

  const handleStartReading = useCallback(() => {
    navigate(`/novel/${currentNovel.id}`)
  }, [navigate, currentNovel.id])

  const handlePrevNovel = useCallback(() => {
    setCurrentNovelIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : novels.length - 1))
  }, [novels.length])

  const handleNextNovel = useCallback(() => {
    setCurrentNovelIndex((prevIndex) => (prevIndex < novels.length - 1 ? prevIndex + 1 : 0))
  }, [novels.length])

  const toggleFullScreenImage = useCallback(() => {
    setIsFullScreenImage((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFullScreenImage) {
          setIsFullScreenImage(false)
        } else {
          handleClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [handleClose, isFullScreenImage])

  return (
    <ModalOverlay onClick={handleClose} $isClosing={isClosing}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <LeftCarouselButton onClick={handlePrevNovel}>
          <ChevronLeft />
        </LeftCarouselButton>
        <RightCarouselButton onClick={handleNextNovel}>
          <ChevronRight />
        </RightCarouselButton>
        <NovelCoverContainer $isClosing={isClosing}>
          <NovelCover 
            src={currentNovel.coverUrl} 
            alt={`${currentNovel.novelName} Cover`} 
            onClick={toggleFullScreenImage}
          />
        </NovelCoverContainer>
        <DetailContainer $isClosing={isClosing}>
          <TextContent>
            <NovelTitle>{currentNovel.novelName}</NovelTitle>
            <Description>
              <ReactMarkdown>{currentNovel.novelDescription}</ReactMarkdown>
            </Description>
            <Divider />
            <CharacterName>{currentNovel.characterName}</CharacterName>
            <Description>
              <ReactMarkdown>{currentNovel.characterDescription}</ReactMarkdown>
            </Description>
            <Divider />
            <ButtonContainer>
              <StartReadingButton onClick={handleStartReading}>开始阅读</StartReadingButton>
              <ReturnButton onClick={handleClose}>放回书架</ReturnButton>
            </ButtonContainer>
            <MobileCarouselButtons>
              <MobileCarouselButton onClick={handlePrevNovel}>
                <ChevronLeft />
              </MobileCarouselButton>
              <MobileCarouselButton onClick={handleNextNovel}>
                <ChevronRight />
              </MobileCarouselButton>
            </MobileCarouselButtons>
          </TextContent>
          <CharacterImageContainer>
            <CharacterImage src={currentNovel.imageUrl} alt={currentNovel.characterName} />
          </CharacterImageContainer>
        </DetailContainer>
      </ModalContent>
      {isFullScreenImage && (
        <FullScreenOverlay onClick={toggleFullScreenImage}>
          <FullScreenImage src={currentNovel.coverUrl} alt={`${currentNovel.novelName} Cover`} />
        </FullScreenOverlay>
      )}
    </ModalOverlay>
  )
}