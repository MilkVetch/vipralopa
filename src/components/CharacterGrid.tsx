import React, { useState } from 'react';
import styled from 'styled-components';
import BookDetailModal from './BookDetailModal';
import { useBooklist, Novel } from '../utils/parseBooklist';

const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  overflow: visible;
  clip-path: inset(0px 0px -10px 0px);
`;

const CharacterImage = styled.img`
  position: relative;
  max-width: 150px;
  height: auto;
  cursor: pointer;
  filter: brightness(0.8);
  transition: transform 0.3s ease, filter 0.3s ease, z-index 0.3s ease;

  &:hover {
    z-index: 10;
    transform: scale(1.05);
    filter: brightness(1.3);
  }

  &:nth-child(1) {
    z-index: 1;
    margin-right: -60px;
    margin-left: 30px;
  }

  &:nth-child(2) {
    z-index: 2;
    margin-right: -40px;
  }

  &:nth-child(3) {
    z-index: 4;
    margin-right: -50px;
  }

  &:nth-child(4) {
    z-index: 3;
    margin-right: -45px;
  }

  &:nth-child(5) {
    z-index: 2;
    margin-right: -55px;
  }

  &:nth-child(6) {
    z-index: 1;
    margin-right: 30px;
  }

  @media (min-width: 1200px) {
    max-width: 240px;
    margin-right: -80px;

    &:nth-child(1) {
      margin-left: 80px;
    }

    &:nth-child(6) {
      margin-right: 80px;
    }
  }

  @media (max-width: 1199px) and (min-width: 768px) {
    max-width: 200px;
    margin-right: -60px;

    &:nth-child(1) {
      margin-left: 60px;
    }

    &:nth-child(6) {
      margin-right: 60px;
    }
  }

  @media (max-width: 767px) {
    max-width: 120px;
    margin-right: -30px;

    &:nth-child(1) {
      margin-left: 20px;
    }

    &:nth-child(6) {
      margin-right: 20px;
    }
  }
`;

export default function CharacterGrid() {
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const novels = useBooklist();

  const orderedNovels = [
    novels.find(novel => novel.id === 6), // 阿罗哈
    novels.find(novel => novel.id === 3), // 阿空迦
    novels.find(novel => novel.id === 2), // 安德鲁·唐
    novels.find(novel => novel.id === 1), // 李荣轩
    novels.find(novel => novel.id === 5), // X
    novels.find(novel => novel.id === 4), // 张琳
  ].filter((novel): novel is Novel => novel !== undefined);

  const handleCloseModal = () => {
    setSelectedNovel(null);
  };

  if (novels.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid>
        {orderedNovels.map((novel) => (
          <CharacterImage
            key={novel.id}
            src={novel.imageUrl}
            alt={novel.characterName}
            onClick={() => setSelectedNovel(novel)}
          />
        ))}
      </Grid>
      {selectedNovel && (
        <BookDetailModal
          novels={novels}
          initialNovelId={selectedNovel.id}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}