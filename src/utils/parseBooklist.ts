import { useState, useEffect } from 'react';

export interface Novel {
  id: number;
  novelName: string;
  characterName: string;
  characterDescription: string;
  novelDescription: string;
  imageUrl: string;
  coverUrl: string;
}

export const useBooklist = () => {
  const [novels, setNovels] = useState<Novel[]>([]);

  useEffect(() => {
    fetch('/booklist.md')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const parsedNovels: Novel[] = [];
        let currentNovel: Partial<Novel> = {};

        lines.forEach((line, index) => {
          if (line.startsWith('#### ')) {
            if (Object.keys(currentNovel).length > 0) {
              parsedNovels.push(currentNovel as Novel);
            }
            currentNovel = {
              id: parsedNovels.length + 1,
              novelName: line.replace('#### ', '').trim(),
            };
          } else if (line.startsWith('##### ')) {
            currentNovel.characterName = line.replace('##### ', '').trim();
          } else if (line.startsWith('###### ')) {
            currentNovel.characterDescription = line.replace('###### ', '').trim();
          } else if (line.trim() !== '') {
            currentNovel.novelDescription = line.trim();
          }

          if (index === lines.length - 1 && Object.keys(currentNovel).length > 0) {
            parsedNovels.push(currentNovel as Novel);
          }
        });

        const novelsWithImages = parsedNovels.map(novel => ({
          ...novel,
          imageUrl: `/img/characters/novel${novel.id}.png`,
          coverUrl: `/img/cover/novel${novel.id}.jpg`,
        }));

        setNovels(novelsWithImages);
      });
  }, []);

  return novels;
};